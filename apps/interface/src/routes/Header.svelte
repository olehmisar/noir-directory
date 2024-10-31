<script lang="ts">
  import { page } from "$app/stores";
  import { lib } from "$lib";
  import SearchForm from "$lib/components/SearchForm.svelte";
  import { route } from "$lib/ROUTES";
  import { Ui } from "@repo/ui";

  function isActive(href: string) {
    if (href === "/") {
      return $page.url.pathname === "/";
    }
    return $page.url.pathname.startsWith(href);
  }
</script>

<header
  class={Ui.cn(
    "sticky top-0 z-[100] flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6",
    $page.url.pathname === "/" ? "" : "mb-6",
  )}
>
  <nav
    class="flex w-full flex-row items-center justify-between gap-5 text-sm font-medium lg:gap-6"
  >
    <a href={route("/")} class="text-2xl font-bold">{lib.APP_NAME}</a>

    {#if ![route("/"), route("/search")].includes($page.url.pathname)}
      <div class="max-w-[40%] grow">
        <SearchForm noButtonHighlight />
      </div>
    {/if}

    <div>
      <Ui.Button
        href="https://github.com/olehmisar/noir-crates-index"
        variant="outline"
      >
        Add Crate
      </Ui.Button>
    </div>
  </nav>
</header>

{#snippet link({ text, href }: { text: string; href: string })}
  <a
    {href}
    class={Ui.cn(
      "transition-colors hover:text-foreground",
      isActive(href) ? "text-foreground" : "text-muted-foreground",
    )}
  >
    {text}
  </a>
{/snippet}
