import type { PropertiesFilter, PropertySort } from "@/types/property";
import { getProperties } from "@/utils/propertyService";
import PropertyCard from "./PropertyCard";
import PropertyFilter from "./PropertyFilter";
import T from "./typography";

type SearchParams = Record<string, string | string[] | undefined>;

type PropertyListProps = {
  searchParams: Promise<SearchParams>;
};

function readNumber(value: string | string[] | undefined): number | undefined {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : undefined;
}

function readSort(value: string | string[] | undefined): PropertySort | undefined {
  return value === "price_asc" || value === "price_desc" ? value : undefined;
}

// Server Component: hämtar listan från backend innan sidan skickas till webbläsaren.
export default async function PropertyList({ searchParams }: PropertyListProps) {
  const params = await searchParams;

  const filter: PropertiesFilter = {
    location: params.location?.toString() || undefined,
    max_price: readNumber(params.max_price),
    guests: readNumber(params.guests),
    sort: readSort(params.sort),
  };

  const properties = await getProperties(filter);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <T.Header size="lg">Places to stay</T.Header>
        <PropertyFilter filter={filter} />
      </div>
      {properties.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">No stays match your search.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {properties.map((property) => (
            <PropertyCard key={property.property_id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
