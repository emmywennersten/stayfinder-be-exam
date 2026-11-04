import type { Database } from "./database.types";

type PropertyRow = Database["public"]["Tables"]["properties"]["Row"];

export type PropertyKind = "apartment" | "villa";

export type Property = Omit<PropertyRow, "kind"> & {
  kind: PropertyKind;
};

export type PropertySort = "price_asc" | "price_desc";

export type PropertiesFilter = {
  location?: string;
  max_price?: number;
  guests?: number;
  sort?: PropertySort;
};
