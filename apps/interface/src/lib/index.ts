import { browser } from "$app/environment";
import { QueryClient } from "@tanstack/svelte-query";
import { QueriesService } from "./services/QueriesService.svelte.js";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      enabled: browser,
    },
  },
});

const queries = new QueriesService(queryClient);

const APP_NAME = "Noir Directory";
export const lib = {
  APP_NAME,
  queries,
};
