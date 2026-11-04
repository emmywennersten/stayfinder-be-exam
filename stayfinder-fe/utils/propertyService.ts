import type { ApiResult } from "@/types/api";
import type { PropertiesFilter, Property } from "@/types/property";
import { apiRequest, apiUrl } from "./api";

// Körs på servern (Server Component). Kastar fel så att error.tsx visas.
export async function getProperties(filter: PropertiesFilter = {}): Promise<Property[]> {
  const params = new URLSearchParams();

  if (filter.location) params.set("location", filter.location);
  if (filter.max_price) params.set("max_price", String(filter.max_price));
  if (filter.guests) params.set("guests", String(filter.guests));
  if (filter.sort) params.set("sort", filter.sort);

  const query = params.toString();
  const response = await fetch(apiUrl(`/properties${query ? `?${query}` : ""}`), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Could not fetch properties (${response.status})`);
  }

  return (await response.json()) as Property[];
}

// Returnerar null vid 404 (då visas not-found-sidan), kastar vid andra fel.
export async function getPropertyById(id: string): Promise<Property | null> {
  const response = await fetch(apiUrl(`/properties/${id}`), { cache: "no-store" });

  if (response.status === 404 || response.status === 400) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Could not fetch property (${response.status})`);
  }

  return (await response.json()) as Property;
}

export type NewPropertyInput = Pick<
  Property,
  "title" | "description" | "location" | "kind" | "max_guests" | "price_per_night"
>;

export function createProperty(input: NewPropertyInput): Promise<ApiResult<Property>> {
  return apiRequest<Property>("/properties", { method: "POST", body: input });
}
