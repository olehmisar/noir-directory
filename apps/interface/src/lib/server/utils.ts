import { utils } from "@repo/utils";
import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";
import { z } from "zod";

export async function markdownToSafeHtml(markdown: string) {
  const html = await marked(markdown);
  return DOMPurify.sanitize(html) as SafeHtml;
}

export type SafeHtml = z.infer<typeof SafeHtmlSchema>;
export const SafeHtmlSchema = z.string().brand("SafeHtml");

/**
 * If promise resolves within timeoutMs, returns a function that resolves with the promise data.
 * Otherwise returns a function that resolves with the promise itself.
 */
export async function streamIfSlow<T>(
  promise: Promise<T>,
  timeoutMs: string | number = "0.1 sec",
) {
  const raced = await Promise.race([promise, utils.sleep(timeoutMs)]);
  return () => {
    return raced ?? promise;
  };
}
