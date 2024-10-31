<script lang="ts">
  import CrateCard from "$lib/components/CrateCard.svelte";
  import { Ui } from "@repo/ui";
  import { Github } from "lucide-svelte";

  let { data } = $props();
</script>

<Ui.GapContainer class="container">
  <Ui.H1>
    {data.owner}
  </Ui.H1>

  <Ui.Link href="https://github.com/{data.owner}" target="_blank">
    <Github size={16} class="inline" /> Github
  </Ui.Link>

  <section>
    <Ui.H2>Crates by {data.owner}</Ui.H2>
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {#each data.crates as crate}
        <CrateCard {crate} />
      {/each}
    </div>
  </section>
</Ui.GapContainer>
