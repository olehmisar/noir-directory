import Fuse from "fuse.js";
import { orderBy } from "lodash-es";
import { z } from "zod";
import type { CacheService } from "./CacheService.js";
import {
  CRATE_INDEX_CACHE_TIME,
  CrateGeneralInfoSchema,
  type CrateGeneralInfo,
  type GithubService,
} from "./GithubService.js";

export class CratesIndexService {
  constructor(
    private github: GithubService,
    private cache: CacheService,
  ) {}

  async getCratesIndex(): Promise<CrateGeneralInfo[]> {
    return await this.cache.cached({
      key: `cratesIndexExtended`,
      ttlMs: CRATE_INDEX_CACHE_TIME,
      schema: z.array(CrateGeneralInfoSchema),
      fn: async () => {
        const crates = await this.github.fetchIndexFromGithub();
        // TODO: this will timeout if there are too many crates
        let repoData = [];
        for (const crate of crates) {
          try {
            const info = await this.github.getGeneralInfo(crate);
            repoData.push(info);
          } catch (e) {
            console.log(e);
          }
        }
        repoData = orderBy(repoData, (r) => r.stars, "desc");
        return repoData;
      },
    });
  }

  async searchCrates(query: string): Promise<CrateGeneralInfo[]> {
    const allRepos = await this.getCratesIndex();
    const fuse = new Fuse(allRepos, {
      keys: [
        {
          name: "name",
          weight: 10,
        },
        {
          name: "description",
          weight: 3,
        },
      ],
    });
    return fuse.search(query).map((x) => x.item);
  }

  async getCratesByOwner(owner: string): Promise<CrateGeneralInfo[]> {
    const allRepos = await this.getCratesIndex();
    return allRepos.filter((r) => r.owner.username === owner);
  }

  async getCratesByKeyword(keyword: string): Promise<CrateGeneralInfo[]> {
    const allRepos = await this.getCratesIndex();
    return allRepos.filter((r) =>
      r.keywords.map((k) => k.toLowerCase()).includes(keyword.toLowerCase()),
    );
  }
}

export const CrateIndexEntrySchema = z.object({
  name: z.string(),
  owner: z.string(),
  repo: z.string(),
  installDirectory: z.string().optional(),
  keywords: z.array(z.string()),
});

export interface CrateIndexEntrySchema
  extends z.infer<typeof CrateIndexEntrySchema> {}
