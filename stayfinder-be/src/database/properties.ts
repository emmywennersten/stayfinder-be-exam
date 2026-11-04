import type { AppSupabaseClient } from "../lib/supabase.js";
import type {
  NewProperty,
  Property,
  PropertyListQuery,
  PropertyUpdate,
} from "../types/property.js";

const TABLE = "properties";

export async function listProperties(
  supabase: AppSupabaseClient,
  query: PropertyListQuery,
): Promise<Property[]> {
  let request = supabase.from(TABLE).select("*");

  if (query.location) {
    request = request.ilike("location", `%${query.location}%`);
  }

  if (query.max_price !== undefined) {
    request = request.lte("price_per_night", query.max_price);
  }

  if (query.guests !== undefined) {
    request = request.gte("max_guests", query.guests);
  }

  const sortColumn = query.sort ? "price_per_night" : "created_at";
  const ascending = query.sort === "price_asc";

  const { data, error } = await request.order(sortColumn, { ascending });

  if (error) {
    throw error;
  }

  return data as Property[];
}

export async function getPropertyById(
  supabase: AppSupabaseClient,
  propertyId: string,
): Promise<Property | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("property_id", propertyId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as Property | null;
}

export async function createProperty(
  supabase: AppSupabaseClient,
  userId: string,
  property: NewProperty,
): Promise<Property> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({ ...property, user_id: userId })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Property;
}

export async function updateProperty(
  supabase: AppSupabaseClient,
  propertyId: string,
  changes: PropertyUpdate,
): Promise<Property | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .update(changes)
    .eq("property_id", propertyId)
    .select()
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as Property | null;
}

export async function deleteProperty(
  supabase: AppSupabaseClient,
  propertyId: string,
): Promise<Property | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .delete()
    .eq("property_id", propertyId)
    .select()
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as Property | null;
}