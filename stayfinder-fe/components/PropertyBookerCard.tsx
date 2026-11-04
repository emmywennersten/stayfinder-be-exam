"use client";

import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/contexts/auth";
import type { Booking, BookingInput } from "@/types/booking";
import type { Property } from "@/types/property";
import * as bookingService from "@/utils/bookingService";
import AuthGate from "./AuthGate";
import BookingForm from "./BookingForm";
import type { BookingFormResult } from "./BookingForm";
import BookingList from "./BookingList";
import T from "./typography";
import { cardClassName } from "./ui";

type PropertyBookerCardProps = {
  property: Property;
};

export default function PropertyBookerCard({ property }: PropertyBookerCardProps) {
  return (
    <section className={`${cardClassName} flex flex-col gap-4`}>
      <T.Header size="md">Book this stay</T.Header>
      <AuthGate message="You need to be logged in to book this stay.">
        <BookingSection property={property} />
      </AuthGate>
    </section>
  );
}

// Visas bara för inloggade, eftersom AuthGate stoppar utloggade.
function BookingSection({ property }: PropertyBookerCardProps) {
  const auth = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string>();
  const [successMessage, setSuccessMessage] = useState<string>();
  const [formKey, setFormKey] = useState(0);

  const loadBookings = useCallback(async () => {
    const result = await bookingService.getBookings(property.property_id);
    if (result.ok) {
      setBookings(result.data);
      setLoadError(undefined);
    } else {
      setLoadError(result.message);
    }
    setLoading(false);
  }, [property.property_id]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  async function onCreate(input: BookingInput): Promise<BookingFormResult> {
    setSuccessMessage(undefined);
    const result = await bookingService.createBooking(property.property_id, input);
    if (!result.ok) {
      return { error: result.message, fieldErrors: result.fieldErrors };
    }
    setSuccessMessage("Your booking is saved!");
    setFormKey((key) => key + 1); // Tömmer formuläret genom att skapa ett nytt.
    await loadBookings();
    return {};
  }

  async function onUpdate(bookingId: string, input: BookingInput): Promise<BookingFormResult> {
    const result = await bookingService.updateBooking(bookingId, input);
    if (!result.ok) {
      return { error: result.message, fieldErrors: result.fieldErrors };
    }
    await loadBookings();
    return {};
  }

  async function onDelete(bookingId: string): Promise<string | undefined> {
    const result = await bookingService.deleteBooking(bookingId);
    if (!result.ok) {
      return result.message;
    }
    await loadBookings();
    return undefined;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <BookingForm
          key={formKey}
          property={property}
          defaultEmail={auth.user?.email}
          submitLabel="Book"
          onSubmit={onCreate}
        />
        {successMessage && (
          <p className="text-sm text-green-700 dark:text-green-400">{successMessage}</p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <T.Header size="sm">Bookings for this stay</T.Header>
        {loading && <p className="text-sm text-zinc-500">Loading bookings…</p>}
        {loadError && <p className="text-sm text-red-600 dark:text-red-400">{loadError}</p>}
        {!loading && !loadError && (
          <BookingList
            property={property}
            bookings={bookings}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        )}
      </div>
    </div>
  );
}
