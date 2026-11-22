export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-10-01";

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Falta NEXT_PUBLIC_SANITY_PROJECT_ID en .env.local"
);

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Falta NEXT_PUBLIC_SANITY_DATASET en .env.local"
);

function assertValue<T>(value: T | undefined, message: string): T {
  if (value === undefined || value === "") throw new Error(message);
  return value;
}
