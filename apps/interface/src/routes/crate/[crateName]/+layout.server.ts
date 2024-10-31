import { serverLib } from "$lib/server";
import { error } from "@sveltejs/kit";

export async function load(event) {
  const crateFromIndex = (await serverLib.github.fetchIndexFromGithub()).find(
    (c) => c.name.toLowerCase() === event.params.crateName.toLowerCase(),
  );
  if (!crateFromIndex) {
    error(404, "Not found");
  }
  const crate = await serverLib.github.getGithubInfo({
    crate: crateFromIndex,
    tag: event.params.tag,
  });
  if (!crate) {
    error(404, "Not found");
  }
  return { crate };
}
