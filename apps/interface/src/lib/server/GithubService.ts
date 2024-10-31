import { Octokit } from "@octokit/rest";
import { utils } from "@repo/utils";
import ky from "ky";
import { compact } from "lodash-es";
import ms from "ms";
import toml from "toml";
import { z } from "zod";
import type { CacheService } from "./CacheService.js";
import { envConfig } from "./config.js";
import { CrateIndexEntrySchema } from "./CratesIndexService.js";
import { markdownToSafeHtml, type SafeHtml } from "./utils.js";

const LATEST_VERSION_CACHE_TIME = ms("10 min");
export const CRATE_INDEX_CACHE_TIME = ms("1 hour");

export class GithubService {
  private octokit = new Octokit({
    auth: envConfig.OCTOKIT_TOKEN,
  });

  constructor(private cache: CacheService) {}

  async getGeneralInfo(
    localCrate: CrateIndexEntrySchema,
  ): Promise<CrateGeneralInfo> {
    const result = await this.cache.cached({
      key: `repo:${localCrate.owner}/${localCrate.repo}`,
      ttlMs: LATEST_VERSION_CACHE_TIME,
      fn: async () =>
        this._unwrap(
          await this.octokit.rest.repos.get({
            owner: localCrate.owner,
            repo: localCrate.repo,
          }),
        ),
    });
    return {
      owner: {
        username: result.owner.login,
        url: result.owner.html_url,
      },
      repo: {
        name: result.name,
        url: result.html_url,
      },
      name: localCrate.name,
      installDirectory: localCrate.installDirectory,
      stars: result.stargazers_count,
      description: result.description ?? undefined,
      updatedAt: result.updated_at,
      createdAt: result.created_at,
      license: result.license?.name,
      keywords: localCrate.keywords,
    };
  }

  async getGithubInfo({
    crate,
    tag,
  }: {
    crate: CrateIndexEntrySchema;
    tag: string | undefined;
  }): Promise<CrateInfo> {
    const { generalInfo, versions } = await utils.promiseAllObject({
      generalInfo: this.getGeneralInfo(crate),
      versions: this.getVersions(crate.owner, crate.repo, tag),
    });
    const { readme, noirVersion } = await utils.promiseAllObject({
      readme: versions.version
        ? this.getReadmeForVersion({
            owner: crate.owner,
            repo: crate.repo,
            version: versions.version,
          })
        : this.getReadme(crate.owner, crate.repo),
      noirVersion: versions.version
        ? this.getSupportedNoirVersion({
            owner: generalInfo.owner.username,
            repo: generalInfo.repo.name,
            installDirectory: generalInfo.installDirectory,
            version: versions.version,
          })
        : undefined,
    });
    const installInfo = versions.version
      ? `${generalInfo.name} = { tag = "${versions.version}", git = "https://github.com/${generalInfo.owner.username}/${generalInfo.repo.name}/" ${generalInfo.installDirectory ? `, directory = "${generalInfo.installDirectory}"` : ""}}`
      : undefined;
    return {
      ...generalInfo,
      safeReadme: readme ?? undefined,
      installInfo,
      noirVersion: noirVersion ?? undefined,
      ...versions,
    };
  }

  private async getVersions(
    owner: string,
    repo: string,
    tag: string | undefined,
  ) {
    const keywords = await this.cache.cached({
      key: `keywords:${owner}/${repo}/${tag}`,
      ttlMs: LATEST_VERSION_CACHE_TIME,
      schema: z.array(z.object({ tag_name: z.string() })),
      fn: async () =>
        this._unwrap(
          await this.octokit.rest.repos.listReleases({
            owner,
            repo,
            per_page: 100,
          }),
        ),
    });
    let versions = keywords.map((tag) => tag.tag_name);
    if (
      owner.toLowerCase() === "aztecprotocol" &&
      repo.toLowerCase() === "aztec-packages"
    ) {
      versions = versions.filter((v) => v.includes("aztec-packages-"));
    }
    const latestVersion = versions[0];
    const version = tag ? versions.find((v) => v === tag) : latestVersion;
    return { version, versions, latestVersion };
  }

  private async getReadmeForVersion({
    owner,
    repo,
    version,
  }: {
    owner: string;
    repo: string;
    version: string;
  }) {
    return await this.cache.cached({
      key: `readme:${owner}/${repo}/${version}`,
      ttlMs: ms("24 hours"),
      fn: async () => this.fetchReadme({ owner, repo, version }),
    });
  }

  private async getReadme(owner: string, repo: string) {
    return await this.cache.cached({
      key: `readme:${owner}/${repo}`,
      ttlMs: LATEST_VERSION_CACHE_TIME,
      fn: async () => this.fetchReadme({ owner, repo, version: undefined }),
    });
  }

  private async fetchReadme({
    owner,
    repo,
    version,
  }: {
    owner: string;
    repo: string;
    version: string | undefined;
  }): Promise<SafeHtml | null> {
    try {
      const readmeResult = await this.octokit.rest.repos.getReadme({
        owner,
        repo,
        ref: version,
        mediaType: {
          format: "raw",
        },
      });
      const readme = await markdownToSafeHtml(
        readmeResult.data as unknown as string,
      );
      return readme;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  private async getSupportedNoirVersion(crate: {
    owner: string;
    repo: string;
    version: string;
    installDirectory: string | undefined;
  }) {
    const result = await this.cache.cached({
      key: `supportedNoirVersion:${crate.owner}/${crate.repo}/${crate.version}`,
      ttlMs: ms("24 hours"),
      schema: z.string().nullish(),
      fn: async () => {
        try {
          return this._unwrap(
            await this.octokit.rest.repos.getContent({
              owner: crate.owner,
              repo: crate.repo,
              ref: crate.version,
              path: `${crate.installDirectory ?? ""}/Nargo.toml`,
              mediaType: {
                format: "raw",
              },
            }),
          ) as unknown as string;
        } catch (e) {
          return null;
        }
      },
    });

    if (!result) {
      return null;
    }

    let nargoToml;
    try {
      nargoToml = toml.parse(result as unknown as string);
    } catch (e) {
      console.error(e);
      return null;
    }
    const noirVersion = nargoToml?.package?.compiler_version;
    if (!noirVersion || typeof noirVersion !== "string") {
      return null;
    }
    return noirVersion;
  }

  private _unwrap<
    T extends {
      data: unknown;
      status: number;
    },
  >(result: T): T["data"] {
    if (!result || Number((result as any).status) !== 200) {
      console.error(result);
      throw new Error("Internal error: failed to fetch from Github");
    }
    return result.data;
  }

  async fetchIndexFromGithub(): Promise<CrateIndexEntrySchema[]> {
    const crates = await this.cache.cached({
      key: "cratesIndex",
      ttlMs: CRATE_INDEX_CACHE_TIME,
      fn: async () => {
        return await ky(
          "https://raw.githubusercontent.com/olehmisar/noir-crates-index/refs/heads/main/crates.json",
        ).json<Record<string, object>>();
      },
    });

    return compact(
      Object.entries(crates).map(([name, c]) => {
        const parsed = CrateIndexEntrySchema.safeParse({ ...c, name });
        if (!parsed.success) {
          console.error(`Failed to parse crate "${name}": ${parsed.error}`);
          return undefined;
        }
        return parsed.data;
      }),
    );
  }
}

export const CrateGeneralInfoSchema = z.object({
  name: z.string(),
  installDirectory: z.string().optional(),
  owner: z.object({
    username: z.string(),
    url: z.string(),
  }),
  repo: z.object({
    name: z.string(),
    url: z.string(),
  }),
  stars: z.number(),
  description: z.string().optional(),
  updatedAt: z.string(),
  createdAt: z.string(),
  license: z.string().optional(),
  keywords: z.array(z.string()),
});

export interface CrateGeneralInfo
  extends z.infer<typeof CrateGeneralInfoSchema> {}
export interface CrateInfo extends CrateGeneralInfo {
  safeReadme: SafeHtml | undefined;
  installInfo: string | undefined;
  version: string | undefined;
  noirVersion: string | undefined;
  latestVersion: string | undefined;
  versions: string[];
}
