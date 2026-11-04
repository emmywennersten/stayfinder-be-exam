import type { Database } from "./database.types.js";

type PropertyTable = Database["public"]["Tables"]["properties"];

export type PropertyKind = "apartment" | "villa";

export type Property = Omit<PropertyTable["Row"], "kind"> & {
  kind: PropertyKind;
};

export type NewProperty = Omit<
  PropertyTable["Insert"],
  "property_id" | "created_at" | "user_id" | "kind"
> & {
  kind?: PropertyKind;
};

export type PropertyUpdate = Partial<NewProperty>;

export type PropertySort = "price_asc" | "price_desc";

export type PropertyListQuery = {
  location?: string;
  max_price?: number;
  guests?: number;
  sort?: PropertySort;
};