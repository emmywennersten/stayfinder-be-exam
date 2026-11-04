"use client";

import { useState } from "react";

import type { Booking, BookingInput } from "@/types/booking";
import type { Property } from "@/types/property";
import { countNights, formatPrice } from "@/utils/price";
import BookingForm from "./BookingForm";
import type { BookingFormResult } from "./BookingForm";
import { secondaryButtonClassName } from "./ui";

type BookingListProps = {
  property: Property;
  bookings: Booking[];
  onUpdate: (bookingId: string, input: BookingInput) => Promise<BookingFormResult>;
  onDelete: (bookingId: string) => Promise<string | undefined>;
};



// Visar bokningarna för ett boende, med knappar för att ändra och ta bort (G12).
export default function BookingList({ property, bookings, onUpdate, onDelete }: BookingListProps) {
  const [editingId, setEditingId] = useState<string>();
  const [deleteError, setDeleteError] = useState<string>();

  async function handleUpdate(bookingId: string, input: BookingInput) {
    const result = await onUpdate(bookingId, input);
    if (!result.error) {
      setEditingId(undefined);
    }
    return result;
  }

  async function handleDelete(bookingId: string) {
    if (!window.confirm("Delete this booking?")) {
      return;
    }
    setDeleteError(await onDelete(bookingId));
  }

  if (bookings.length === 0) {
    return <p className="text-sm text-zinc-600 dark:text-zinc-400">No bookings yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {deleteError && <p className="text-sm text-red-600 dark:text-red-400">{deleteError}</p>}
      {bookings.map((booking) => {
        const nights = countNights(booking.check_in, booking.check_out);

        if (editingId === booking.booking_id) {
          return (
            <li key={booking.booking_id} className="rounded-lg border border-zinc-300 p-4 dark:border-zinc-700">
              <BookingForm
                property={property}
                initialBooking={booking}
                submitLabel="Save changes"
                onSubmit={(input) => handleUpdate(booking.booking_id, input)}
                onCancel={() => setEditingId(undefined)}
              />
            </li>
          );
        }

        return (
          <li
            key={booking.booking_id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 p-4 text-sm dark:border-zinc-800"
          >
            <div className="flex flex-col gap-1">
              <p className="font-medium">
                {booking.guest_name} · {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
              </p>
              <p className="text-zinc-600 dark:text-zinc-400">
                {booking.check_in} → {booking.check_out} ({nights} nights,{" "}
                {formatPrice(nights * property.price_per_night)})
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditingId(booking.booking_id)}
                className={secondaryButtonClassName}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(booking.booking_id)}
                className={secondaryButtonClassName}
              >
                Delete
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
