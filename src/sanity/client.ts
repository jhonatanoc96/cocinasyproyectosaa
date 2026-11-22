import { createClient, type QueryParams } from "next-sanity";
import { cacheLife, cacheTag } from "next/cache";
import { apiVersion, dataset, projectId } from "./env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Next caches every query; the Sanity CDN would only add a second, stale layer
  // right after publishing (the webhook revalidates and refetches immediately).
  useCdn: false,
});

/**
 * Cached Sanity read, tagged "sanity". Publishing in the Studio fires a webhook
 * (/api/revalidate) that expires the tag, so changes show up on the next visit.
 * cacheLife("hours") is only a safety net in case a webhook is missed.
 */
export async function sanityFetch<T>(
  query: string,
  params: QueryParams = {}
): Promise<T> {
  "use cache";
  cacheLife("hours");
  cacheTag("sanity");
  return client.fetch<T>(query, params);
}
