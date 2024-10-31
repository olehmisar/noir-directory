import { Redis } from "@upstash/redis";
import { CacheService } from "./CacheService.js";
import { envConfig } from "./config.js";
import { CratesIndexService } from "./CratesIndexService.js";
import { GithubService } from "./GithubService.js";

const redis = new Redis({
  url: envConfig.UPSTASH_URL,
  token: envConfig.UPSTASH_TOKEN,
});
const cache = new CacheService(redis);
const github = new GithubService(cache);
const cratesIndex = new CratesIndexService(github, cache);
export const serverLib = {
  github,
  cratesIndex,
};
