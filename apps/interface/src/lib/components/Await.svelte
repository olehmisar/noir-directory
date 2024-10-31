<script lang="ts" generics="T">
  import { utils } from "@repo/utils";
  import type { Snippet } from "svelte";

  let { promise, success }: { promise: Promise<T> | T; success: Snippet<[T]> } =
    $props();
</script>

{#await promise}
  <div>Loading...</div>
{:then data}
  {@render success(data)}
{:catch error}
  <div>Error: {utils.errorToString(error)}</div>
{/await}
