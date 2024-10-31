import { serverLib } from "$lib/server";
import { streamIfSlow } from "$lib/server/utils.js";

export async function load(event) {
  const keyword = event.params.keyword;
  const crates = await streamIfSlow(
    serverLib.cratesIndex.getCratesByKeyword(keyword),
  );
  return {
    keyword,
    crates: crates(),
  };
}
