<script lang="ts">
  import { lib } from "$lib";
  import { route } from "$lib/ROUTES";
  import type { CrateInfo } from "$lib/server/GithubService";
  import { Ui } from "@repo/ui";
  import { formatDistanceToNow } from "date-fns";
  import { Github } from "lucide-svelte";
  import CrateName from "./CrateName.svelte";
  import KeywordBadge from "./KeywordBadge.svelte";

  let {
    crate,
  }: {
    crate: CrateInfo;
  } = $props();
</script>

<svelte:head>
  <title>{crate.name} - {lib.APP_NAME}</title>
</svelte:head>

<div class="flex flex-col gap-8 p-8">
  <Ui.Card.Root>
    <Ui.Card.Header>
      <Ui.Card.Title>
        <CrateName {crate} />
      </Ui.Card.Title>
      <Ui.Card.Description>
        {crate.version}
        {#if crate.noirVersion}
          &middot; Compatible with Noir {crate.noirVersion}
        {/if}
      </Ui.Card.Description>
    </Ui.Card.Header>
  </Ui.Card.Root>

  <div class="grid grid-cols-1 gap-8 lg:grid-cols-7">
    <main class="lg:col-span-5">
      <Ui.Tabs.Root value="readme">
        <Ui.Tabs.List>
          <Ui.Tabs.Trigger value="readme">README</Ui.Tabs.Trigger>
          <Ui.Tabs.Trigger value="versions">Versions</Ui.Tabs.Trigger>
        </Ui.Tabs.List>
        <Ui.Tabs.Content value="readme">
          <div class="prose mt-4 max-w-none dark:prose-invert">
            {@html crate.safeReadme}
          </div>
        </Ui.Tabs.Content>
        <Ui.Tabs.Content value="versions">
          <Ui.GapContainer class="gap-2">
            <h3 class="text-lg font-semibold">Versions</h3>
            {#each crate.versions as version}
              <div class="flex items-center gap-2 text-sm">
                <a
                  href={route("/crate/[crateName]/[tag]", {
                    crateName: crate.name,
                    tag: version,
                  })}
                  class="flex items-center gap-2 text-sm"
                >
                  <span>{version}</span>
                  {#if version === crate.latestVersion}
                    <Ui.Badge variant="secondary">Latest</Ui.Badge>
                  {/if}
                </a>
              </div>
            {/each}
          </Ui.GapContainer>
        </Ui.Tabs.Content>
      </Ui.Tabs.Root>
    </main>

    <aside class="lg:col-span-2">
      <div class="space-y-6">
        <Ui.GapContainer class="gap-2">
          <h3 class="text-lg font-semibold">Installation</h3>
          {#if crate.installInfo}
            <div>Add this to your Nargo.toml</div>
            <div class="flex items-center space-x-2">
              <Ui.Input readonly value={crate.installInfo} />
              <Ui.CopyButton
                text={crate.installInfo}
                variant="default"
                size="icon"
              />
            </div>
          {:else}
            <div>No release found</div>
          {/if}
        </Ui.GapContainer>
        <div>
          <h3 class="mb-2 text-lg font-semibold">Package Info</h3>
          <div class="space-y-4">
            <div>
              <h4 class="text-sm font-semibold">GitHub</h4>
              <div class="flex items-center space-x-2 text-sm">
                <Github size={16} />

                <div>
                  <Ui.Link
                    href={crate.repo.url}
                    target="_blank"
                    class="text-sm"
                  >
                    Repository
                  </Ui.Link>

                  &middot;

                  <span>{crate.stars} stars</span>
                </div>
              </div>
            </div>
            <div>
              <h4 class="text-sm font-semibold">Author</h4>
              <Ui.Link
                href={route("/user/[owner]", {
                  owner: crate.owner.username,
                })}
                class="text-sm"
              >
                {crate.owner.username}
              </Ui.Link>
            </div>
            <div>
              <h4 class="text-sm font-semibold">License</h4>
              <p class="text-sm">{crate.license || "N/A"}</p>
            </div>
            <div>
              <h4 class="text-sm font-semibold">Published</h4>
              <p class="text-sm">
                {formatDistanceToNow(new Date(crate.updatedAt))} ago
              </p>
            </div>
            <div>
              <h4 class="mb-1 text-sm font-semibold">Keywords</h4>
              <div class="flex flex-wrap gap-2">
                {#each crate.keywords as keyword}
                  <KeywordBadge {keyword} />
                {/each}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </div>
</div>
