import "dotenv/config";
import { z } from "zod";

export const envConfig = z
  .object({
    OCTOKIT_TOKEN: z.string(),
    UPSTASH_URL: z.string(),
    UPSTASH_TOKEN: z.string(),
  })
  .parse(process.env);
