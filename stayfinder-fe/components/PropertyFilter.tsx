"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";

import type { PropertiesFilter } from "@/types/property";
import { buttonClassName, fieldClassName } from "./ui";

type PropertyFilterProps = {
  filter: PropertiesFilter;
};

// Filtren läggs i URL:en (?location=...), och sidan hämtar om listan från backend (G5, G8).
export default function PropertyFilter({ filter }: PropertyFilterProps) {
  const router = useRouter();
  const [location, setLocation] = useState(filter.location ?? "");
  const [maxPrice, setMaxPrice] = useState(filter.max_price?.toString() ?? "");
  const [guests, setGuests] = useState(filter.guests?.toString() ?? "");
  const [sort, setSort] = useState(filter.sort ?? "");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();

    if (location.trim()) params.set("location", location.trim());
    if (maxPrice) params.set("max_price", maxPrice);
    if (guests) params.set("guests", guests);
    if (sort) params.set("sort", sort);

    const query = params.toString();
    router.push(query ? `/?${query}` : "/");
  }

  function onReset() {
    setLocation("");
    setMaxPrice("");
    setGuests("");
    setSort("");
    router.push("/");
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <label className="col-span-2 flex flex-col gap-1 text-sm sm:col-span-4">
        Location
        <input
          type="search"
          value={location}
          placeholder="e.g. Stockholm"
          onChange={(event) => setLocation(event.target.value)}
          className={fieldClassName}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Max price / night
        <input
          type="number"
          min={1}
          value={maxPrice}
          onChange={(event) => setMaxPrice(event.target.value)}
          className={fieldClassName}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Guests
        <input
          type="number"
          min={1}
          value={guests}
          onChange={(event) => setGuests(event.target.value)}
          className={fieldClassName}
        />
      </label>
      <label className="col-span-2 flex flex-col gap-1 text-sm">
        Sort by price
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          className={fieldClassName}
        >
          <option value="">Newest first</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
        </select>
      </label>
      <div className="col-span-2 flex gap-2 sm:col-span-4">
        <button type="submit" className={buttonClassName}>
          Search
        </button>
        <button type="button" onClick={onReset} className="text-sm underline">
          Clear filters
        </button>
      </div>
    </form>
  );
}
