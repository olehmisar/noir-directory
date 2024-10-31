<script lang="ts">
  import logo from "$lib/assets/mach34.png";
  import { Ui } from "@repo/ui";
</script>

<Ui.Tooltip.Root>
  <Ui.Tooltip.Trigger>
    <img src={logo} alt="Mach34 logo" class="size-4" />
  </Ui.Tooltip.Trigger>
  <Ui.Tooltip.Content>
    Created by
    <Ui.Link href="https://mach34.space" target="_blank">Mach34 Team</Ui.Link>
  </Ui.Tooltip.Content>
</Ui.Tooltip.Root>
