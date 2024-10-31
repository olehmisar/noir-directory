<script lang="ts">
  import type { HTMLAnchorAttributes } from "svelte/elements";

  let { children, ...props }: HTMLAnchorAttributes = $props();
</script>

<span class="prose dark:prose-invert">
  <a {...props}>
    {@render children?.()}
  </a>
</span>
