<script lang="ts">
  import "../app.css";

  import { dev } from "$app/environment";
  import { page } from "$app/stores";
  import { lib } from "$lib";
  import { Ui } from "@repo/ui";
  import { QueryClientProvider } from "@tanstack/svelte-query";
  import { inject } from "@vercel/analytics";
  import { ModeWatcher } from "mode-watcher";
  import Footer from "./Footer.svelte";
  import Header from "./Header.svelte";

  let { children } = $props();

  inject({ mode: dev ? "development" : "production" });
</script>

<ModeWatcher />
<QueryClientProvider client={lib.queries.queryClient}>
  <!-- key page by pathname to reset components state on navigation -->
  {#key $page.url.pathname}
    <div class="flex h-full flex-col">
      <div class="grow">
        <Header />

        {@render children()}
      </div>

      <Footer />
    </div>
  {/key}

  <Ui.Toaster position="bottom-right" />
</QueryClientProvider>
