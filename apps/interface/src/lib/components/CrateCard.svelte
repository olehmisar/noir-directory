<script lang="ts">
  import { route } from "$lib/ROUTES";
  import type { CrateGeneralInfo } from "$lib/server/GithubService";
  import { Ui } from "@repo/ui";
  import { Star } from "lucide-svelte";
  import CrateName from "./CrateName.svelte";
  import KeywordBadge from "./KeywordBadge.svelte";

  let {
    crate,
  }: {
    crate: CrateGeneralInfo;
  } = $props();
</script>

<Ui.Card.Root class="flex flex-col">
  <Ui.Card.Header>
    <div class="flex justify-between">
      <div>
        <Ui.Card.Title>
          <CrateName {crate} />
        </Ui.Card.Title>
        <Ui.Card.Description>{crate.description}</Ui.Card.Description>
      </div>
      <a
        href="https://github.com/{crate.owner.username}/{crate.repo.name}"
        target="_blank"
        class="flex items-center gap-1 text-muted-foreground"
      >
        <Star size="16" />
        {crate.stars}
      </a>
    </div>
  </Ui.Card.Header>
  <Ui.Card.Content class="grow">
    <div>
      {#each crate.keywords as keyword}
        <KeywordBadge {keyword} />
      {/each}
    </div>
  </Ui.Card.Content>
</Ui.Card.Root>
