import { createClient, type QueryParams } from "next-sanity";
import { cacheLife, cacheTag } from "next/cache";
import { apiVersion, dataset, projectId } from "./env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

/**
 * Cached Sanity read. Content edited in the Studio shows up on the site within
 * about a minute (cacheLife "minutes"); every entry is tagged "sanity" so a
 * webhook can call revalidateTag('sanity') for instant updates later.
 */
export async function sanityFetch<T>(
  query: string,
  params: QueryParams = {}
): Promise<T> {
  "use cache";
  cacheLife("minutes");
  cacheTag("sanity");
  return client.fetch<T>(query, params);
}
