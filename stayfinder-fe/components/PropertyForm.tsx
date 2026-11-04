"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import type { FieldErrors } from "@/types/api";
import type { PropertyKind } from "@/types/property";
import type { NewPropertyInput } from "@/utils/propertyService";
import FieldError from "./FieldError";
import { buttonClassName, fieldClassName } from "./ui";

export type PropertyFormResult = { error?: string; fieldErrors?: FieldErrors };

type PropertyFormProps = {
  onSubmit: (input: NewPropertyInput) => Promise<PropertyFormResult>;
};

export default function PropertyForm({ onSubmit }: PropertyFormProps) {
  const [error, setError] = useState<string>();
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // FormData ger alltid text, så siffrorna görs om till tal innan de skickas.
    const input: NewPropertyInput = {
      title: String(formData.get("title") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      location: String(formData.get("location") ?? "").trim(),
      kind: String(formData.get("kind") ?? "apartment") as PropertyKind,
      max_guests: Number(formData.get("max_guests")),
      price_per_night: Number(formData.get("price_per_night")),
    };

    setError(undefined);
    setFieldErrors({});
    setPending(true);
    const result = await onSubmit(input);
    setPending(false);

    if (result.error) {
      setError(result.error);
      setFieldErrors(result.fieldErrors ?? {});
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        Title
        <input name="title" className={fieldClassName} />
        <FieldError message={fieldErrors.title} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Description
        <textarea name="description" rows={4} className={fieldClassName} />
        <FieldError message={fieldErrors.description} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Location
        <input name="location" placeholder="e.g. Stockholm, Sweden" className={fieldClassName} />
        <FieldError message={fieldErrors.location} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Kind
        <select name="kind" defaultValue="apartment" className={fieldClassName}>
          <option value="apartment">Apartment</option>
          <option value="villa">Villa</option>
        </select>
        <FieldError message={fieldErrors.kind} />
      </label>
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Max guests
          <input name="max_guests" type="number" min={1} className={fieldClassName} />
          <FieldError message={fieldErrors.max_guests} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Price per night (kr)
          <input name="price_per_night" type="number" min={1} className={fieldClassName} />
          <FieldError message={fieldErrors.price_per_night} />
        </label>
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      <button type="submit" disabled={pending} className={buttonClassName}>
        {pending ? "Creating…" : "Create stay"}
      </button>
    </form>
  );
}
