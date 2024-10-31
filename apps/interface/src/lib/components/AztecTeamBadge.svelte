<script lang="ts">
  import { Ui } from "@repo/ui";
  import { BadgeCheck } from "lucide-svelte";
</script>

<Ui.Tooltip.Root>
  <Ui.Tooltip.Trigger>
    <BadgeCheck class="size-[0.9em] text-[#87ceeb]" />
  </Ui.Tooltip.Trigger>
  <Ui.Tooltip.Content>
    Created by
    <Ui.Link href="https://github.com/AztecProtocol" target="_blank">
      Aztec Team
    </Ui.Link>
  </Ui.Tooltip.Content>
</Ui.Tooltip.Root>
