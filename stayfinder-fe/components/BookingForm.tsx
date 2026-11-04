"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import type { FieldErrors } from "@/types/api";
import type { Booking, BookingDates, BookingInput } from "@/types/booking";
import type { Property } from "@/types/property";
import { countNights, formatPrice } from "@/utils/price";
import BookingPicker from "./BookingPicker";
import FieldError from "./FieldError";
import { buttonClassName, fieldClassName } from "./ui";

export type BookingFormResult = { error?: string; fieldErrors?: FieldErrors };

type BookingFormProps = {
  property: Property;
  initialBooking?: Booking;
  defaultEmail?: string;
  submitLabel: string;
  onSubmit: (input: BookingInput) => Promise<BookingFormResult>;
  onCancel?: () => void;
};

export default function BookingForm({
  property,
  initialBooking,
  defaultEmail,
  submitLabel,
  onSubmit,
  onCancel,
}: BookingFormProps) {
  const [dates, setDates] = useState<BookingDates | undefined>(
    initialBooking
      ? { check_in: initialBooking.check_in, check_out: initialBooking.check_out }
      : undefined,
  );
  const [error, setError] = useState<string>();
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);

  const isEditing = Boolean(initialBooking);

  // Antal nätter och totalpris räknas ut direkt när datumen ändras (G11).
  const nights = dates ? countNights(dates.check_in, dates.check_out) : 0;
  const totalPrice = nights * property.price_per_night;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (!dates) {
      setError("Choose check-in and check-out dates in the calendar.");
      return;
    }

    const input: BookingInput = {
      guest_name: String(formData.get("guest_name") ?? "").trim(),
      guest_email: String(formData.get("guest_email") ?? "").trim(),
      guests: Number(formData.get("guests")),
      check_in: dates.check_in,
      check_out: dates.check_out,
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
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          Name
          <input
            name="guest_name"
            defaultValue={initialBooking?.guest_name}
            className={fieldClassName}
          />
          <FieldError message={fieldErrors.guest_name} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            name="guest_email"
            type="email"
            defaultValue={initialBooking?.guest_email ?? defaultEmail}
            className={fieldClassName}
          />
          <FieldError message={fieldErrors.guest_email} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Guests (max {property.max_guests})
          <input
            name="guests"
            type="number"
            min={1}
            defaultValue={initialBooking?.guests ?? 1}
            className={fieldClassName}
          />
          <FieldError message={fieldErrors.guests} />
        </label>
       
      </div>

      <div className="flex flex-col gap-1">
        <BookingPicker initialDates={dates} onChange={setDates} />
        <FieldError message={fieldErrors.check_in} />
        <FieldError message={fieldErrors.check_out} />
      </div>

      <div className="rounded-lg bg-zinc-100 p-4 text-sm dark:bg-zinc-900">
        {dates ? (
          <p>
            {dates.check_in} → {dates.check_out}: {nights} {nights === 1 ? "night" : "nights"} ×{" "}
            {formatPrice(property.price_per_night)} ={" "}
            <span className="font-semibold">{formatPrice(totalPrice)}</span>
          </p>
        ) : (
          <p className="text-zinc-600 dark:text-zinc-400">
            Choose dates to see the number of nights and the total price.
          </p>
        )}
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={pending} className={buttonClassName}>
          {pending ? "Saving…" : submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-sm underline">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
