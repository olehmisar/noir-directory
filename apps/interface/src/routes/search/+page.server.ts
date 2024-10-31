import { route } from "$lib/ROUTES.js";
import { serverLib } from "$lib/server/index.js";
import { streamIfSlow } from "$lib/server/utils";
import { redirect } from "@sveltejs/kit";

export async function load(event) {
  const query = event.url.searchParams.get("query");
  if (!query) {
    redirect(307, route("/"));
  }
  const result = await streamIfSlow(serverLib.cratesIndex.searchCrates(query));
  return {
    query,
    result: result(),
  };
}
