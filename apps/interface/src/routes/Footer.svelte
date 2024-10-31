<script>
  import { lib } from "$lib";
  import { Ui } from "@repo/ui";
</script>

<footer class="mt-12 bg-gray-100 py-8 dark:bg-gray-900">
  <div class="container mx-auto px-4">
    <div class="flex flex-col items-center justify-between md:flex-row">
      <p class="text-sm text-muted-foreground">
        © {new Date().getFullYear()}
        {lib.APP_NAME}. All rights reserved.
      </p>
      <div class="mb-4 md:mb-0">
        <p class="text-sm">
          Created by <Ui.Link
            href="https://oleh.wtf"
            target="_blank"
            rel="noopener noreferrer"
            class="font-semibold hover:underline"
          >
            oleh
          </Ui.Link>
        </p>
      </div>
    </div>
  </div>
</footer>
