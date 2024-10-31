<script lang="ts">
  import { route } from "$lib/ROUTES";
  import { Ui } from "@repo/ui";

  let { keyword }: { keyword: string } = $props();
</script>

<a href={route("/keywords/[keyword]", { keyword })}>
  <Ui.Badge variant="secondary">{keyword}</Ui.Badge>
</a>
