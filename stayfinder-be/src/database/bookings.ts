import type { AppSupabaseClient } from "../lib/supabase.js";
import type { Booking, BookingUpdate, NewBooking } from "../types/booking.js";

const TABLE = "bookings";

export async function listBookingsForProperty(
  supabase: AppSupabaseClient,
  propertyId: string,
): Promise<Booking[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("property_id", propertyId)
    .order("check_in", { ascending: true });

  if (error) {
    throw error;
  }

  return data as Booking[];
}

export async function getBookingById(
  supabase: AppSupabaseClient,
  bookingId: string,
): Promise<Booking | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("booking_id", bookingId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as Booking | null;
}

export async function createBooking(
  supabase: AppSupabaseClient,
  userId: string,
  propertyId: string,
  booking: NewBooking,
): Promise<Booking> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({ ...booking, property_id: propertyId, user_id: userId })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Booking;
}

export async function updateBooking(
  supabase: AppSupabaseClient,
  bookingId: string,
  changes: BookingUpdate,
): Promise<Booking | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .update(changes)
    .eq("booking_id", bookingId)
    .select()
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as Booking | null;
}

export async function deleteBooking(
  supabase: AppSupabaseClient,
  bookingId: string,
): Promise<Booking | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .delete()
    .eq("booking_id", bookingId)
    .select()
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as Booking | null;
}