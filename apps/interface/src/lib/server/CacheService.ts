import type { Redis } from "@upstash/redis";
import type { z } from "zod";

// needed for cache invalidation when a breaking change(e.g., different schema for cache value) is deployed
const CACHE_VERSION = "14";
export class CacheService {
  constructor(private redis: Redis) {}

  async cached<T>(params: {
    key: string;
    ttlMs: number;
    fn: () => Promise<T>;
    schema?: z.ZodType<T>;
  }): Promise<T> {
    const versionedKey = `${CACHE_VERSION}:${params.key}`;
    const cachedValue = await this.redis.get(versionedKey);
    if (cachedValue) {
      if (params.schema) {
        const parsed = params.schema.safeParse(cachedValue);
        if (parsed.success) {
          return parsed.data;
        }
      } else {
        return cachedValue as T;
      }
    }
    const value = await params.fn();
    await this.redis.set(versionedKey, value, {
      ex: Math.floor(params.ttlMs / 1000),
    });
    return value;
  }
}
