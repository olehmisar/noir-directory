<script>
  import { lib } from "$lib";
  import Await from "$lib/components/Await.svelte";
  import CrateCard from "$lib/components/CrateCard.svelte";
  import SearchForm from "$lib/components/SearchForm.svelte";
  import { Ui } from "@repo/ui";
  let { data } = $props();
</script>

<svelte:head>
  <title>{data.query} - Search {lib.APP_NAME}</title>
</svelte:head>

<Ui.GapContainer class="container">
  <SearchForm />

  <Ui.H2>Search results for "{data.query}"</Ui.H2>
  <Await promise={data.result}>
    {#snippet success(crates)}
      {#each crates as crate}
        <CrateCard {crate} />
      {/each}
    {/snippet}
  </Await>
</Ui.GapContainer>
