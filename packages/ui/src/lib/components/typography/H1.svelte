<script lang="ts">
  import { cn } from "#lib/utils.js";
  import type { HTMLAttributes } from "svelte/elements";

  let { children, ...props }: HTMLAttributes<HTMLHeadingElement> = $props();
</script>

<h1
  {...props}
  class={cn(
    "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
    props.class,
  )}
>
  {@render children?.()}
</h1>
