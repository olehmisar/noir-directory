<script lang="ts">
  import CratePage from "$lib/components/CratePage.svelte";

  let { data } = $props();
</script>

<CratePage crate={data.crate} />
