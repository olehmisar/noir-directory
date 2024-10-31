<script lang="ts">
  import { route } from "$lib/ROUTES";
  import { Ui } from "@repo/ui";
  import { Search } from "lucide-svelte";

  let {
    noButtonHighlight,
  }: {
    noButtonHighlight?: boolean;
  } = $props();
</script>

<form action={route("/search")}>
  <div class="relative w-full">
    <div class="relative flex">
      <Ui.Input
        type="text"
        name="query"
        placeholder="Search Noir crates..."
        class="w-full rounded-l-lg rounded-r-none px-4 py-2 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <Ui.Button
        type="submit"
        class="rounded-l-none"
        variant={noButtonHighlight ? "outline" : "default"}
        size="default"
      >
        <Search class="h-4 w-4" />
        <span class="sr-only">Search</span>
      </Ui.Button>
    </div>
  </div>
</form>
