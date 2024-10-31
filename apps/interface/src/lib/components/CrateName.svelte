<script lang="ts">
  import { route } from "$lib/ROUTES";
  import type { CrateGeneralInfo } from "$lib/server/GithubService";
  import AztecTeamBadge from "./AztecTeamBadge.svelte";
  import Mach34TeamBadge from "./Mach34TeamBadge.svelte";
  import NoirTeamBadge from "./NoirTeamBadge.svelte";
  import ZkEmailTeamBadge from "./ZkEmailTeamBadge.svelte";

  let { crate }: { crate: CrateGeneralInfo } = $props();

  let usernameLower = $derived(crate.owner.username.toLowerCase());
</script>

<a
  href={route("/crate/[crateName]", {
    crateName: crate.name,
  })}
>
  {crate.name}
</a>
{#if usernameLower === "noir-lang"}
  <NoirTeamBadge />
{/if}
{#if usernameLower === "aztecprotocol"}
  <AztecTeamBadge />
{/if}
{#if usernameLower === "mach-34"}
  <Mach34TeamBadge />
{/if}
{#if usernameLower === "zkemail"}
  {#if crate.repo.name === "zkemail.nr"}
    <Mach34TeamBadge />
  {/if}
  <ZkEmailTeamBadge />
{/if}
