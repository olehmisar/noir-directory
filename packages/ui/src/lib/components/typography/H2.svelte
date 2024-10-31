<script lang="ts">
  import { cn } from "#lib/utils.js";
  import type { HTMLAttributes } from "svelte/elements";

  let { children, ...props }: HTMLAttributes<HTMLHeadingElement> = $props();
</script>

<h2
  {...props}
  class={cn(
    "scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0",
    props.class,
  )}
>
  {@render children?.()}
</h2>
