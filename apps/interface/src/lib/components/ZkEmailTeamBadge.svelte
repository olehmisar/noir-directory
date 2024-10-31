<script lang="ts">
  import { Ui } from "@repo/ui";
  import { Mail } from "lucide-svelte";
</script>

<Ui.Tooltip.Root>
  <Ui.Tooltip.Trigger>
    <Mail class="size-[0.9em] text-red-900" />
  </Ui.Tooltip.Trigger>
  <Ui.Tooltip.Content>
    Created by
    <Ui.Link href="https://zk.email" target="_blank">ZK Email Team</Ui.Link>
  </Ui.Tooltip.Content>
</Ui.Tooltip.Root>
