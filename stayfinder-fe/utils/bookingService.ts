import type { Booking, BookingInput } from "@/types/booking";
import { apiRequest } from "./api";

export function getBookings(propertyId: string) {
  return apiRequest<Booking[]>(`/properties/${propertyId}/bookings`);
}

export function createBooking(propertyId: string, input: BookingInput) {
  return apiRequest<Booking>(`/properties/${propertyId}/bookings`, {
    method: "POST",
    body: input,
  });
}

export function updateBooking(bookingId: string, changes: Partial<BookingInput>) {
  return apiRequest<Booking>(`/bookings/${bookingId}`, {
    method: "PATCH",
    body: changes,
  });
}

export function deleteBooking(bookingId: string) {
  return apiRequest<{ message: string }>(`/bookings/${bookingId}`, {
    method: "DELETE",
  });
}
