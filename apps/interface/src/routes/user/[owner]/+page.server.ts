import { serverLib } from "$lib/server";

export async function load(event) {
  const owner = event.params.owner;
  const crates = await serverLib.cratesIndex.getCratesByOwner(owner);
  return {
    owner,
    crates,
  };
}
