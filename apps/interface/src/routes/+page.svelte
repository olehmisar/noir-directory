<script lang="ts">
  import { lib } from "$lib";
  import Await from "$lib/components/Await.svelte";
  import CrateCard from "$lib/components/CrateCard.svelte";
  import SearchForm from "$lib/components/SearchForm.svelte";
  import type { CrateGeneralInfo } from "$lib/server/GithubService";
  import { Ui } from "@repo/ui";
  let { data } = $props();
</script>

<svelte:head>
  <title>{lib.APP_NAME}</title>
  <meta name="description" content="Noir crates" />
  <meta
    name="keywords"
    content="noir, zero knowledge, aztec, crates, noir crates"
  />
</svelte:head>

<main class="relative">
  <div
    class="absolute bottom-0 left-0 right-0 top-0 -z-10"
    style="background-image: url('/banner.jpg'); background-size: cover; background-position: 50% 30%;"
  ></div>
  <div class="container mx-auto mb-8 px-4 py-4 backdrop-blur-sm md:py-16">
    <h1 class="mb-8 text-center text-4xl font-bold text-white md:text-6xl">
      The Noir community's crate registry
    </h1>

    <div class="mx-auto mb-12 max-w-2xl">
      <SearchForm />
    </div>

    <div class="flex justify-center space-x-4">
      <Ui.Button class="px-6 py-2" href="https://noir-lang.org">
        Noir Language
      </Ui.Button>
      <Ui.Button
        class="px-6 py-2"
        href="https://noir-lang.org/docs/getting_started/quick_start"
      >
        Getting Started
      </Ui.Button>
    </div>
  </div>
</main>

<main class="container">
  <section>
    <Ui.H2>Popular Noir crates</Ui.H2>
    <Await promise={data.popularCrates}>
      {#snippet success(crates)}
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {@render categoryBlock("Official Noir crates", crates.noir)}
          {@render categoryBlock("Community crates", crates.community)}
          {@render categoryBlock("Aztec.nr", crates.aztec)}
        </div>
      {/snippet}
    </Await>
  </section>
</main>

{#snippet categoryBlock(title: string, crates: CrateGeneralInfo[])}
  <Ui.GapContainer>
    <h5 class="text-md font-semibold">
      {title}
    </h5>
    {#each crates as crate}
      <CrateCard {crate} />
    {/each}
  </Ui.GapContainer>
{/snippet}
