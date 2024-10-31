<script lang="ts">
  import { cn } from "#lib/utils.js";
  import type { HTMLAttributes } from "svelte/elements";

  let { children, ...props }: HTMLAttributes<HTMLHeadingElement> = $props();
</script>

<h3
  {...props}
  class={cn("scroll-m-20 text-2xl font-semibold tracking-tight", props.class)}
>
  {@render children?.()}
</h3>
