import { serverLib } from "$lib/server";
import { streamIfSlow } from "$lib/server/utils";
import { utils } from "@repo/utils";

export async function load() {
  const crates = await streamIfSlow(
    utils.iife(async () => {
      const crates = await serverLib.cratesIndex.getCratesIndex();
      const aztec = [];
      const noir = [];
      const community = [];
      for (const crate of crates) {
        if (crate.owner.username.toLowerCase() === "aztecprotocol") {
          aztec.push(crate);
        } else if (crate.owner.username.toLowerCase() === "noir-lang") {
          noir.push(crate);
        } else {
          community.push(crate);
        }
      }
      return { aztec, noir, community };
    }),
  );
  return {
    popularCrates: crates(),
  };
}
