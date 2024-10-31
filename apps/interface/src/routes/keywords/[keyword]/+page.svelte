<script lang="ts">
  import { lib } from "$lib";
  import Await from "$lib/components/Await.svelte";
  import CrateCard from "$lib/components/CrateCard.svelte";
  import { Ui } from "@repo/ui";

  let { data } = $props();
</script>

<svelte:head>
  <title>{data.keyword} - Keywords - {lib.APP_NAME}</title>
</svelte:head>

<Ui.GapContainer class="container">
  <Ui.H2>
    All Noir crates for keyword '{data.keyword}'
  </Ui.H2>

  <Ui.GapContainer>
    <Await promise={data.crates}>
      {#snippet success(crates)}
        {#each crates as crate}
          <CrateCard {crate} />
        {/each}
      {/snippet}
    </Await>
  </Ui.GapContainer>
</Ui.GapContainer>
