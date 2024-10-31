import { route } from "$lib/ROUTES";
import { redirect } from "@sveltejs/kit";

export function load() {
  redirect(307, route("/"));
}
