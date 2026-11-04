import type { Database } from "./database.types";

type BookingRow = Database["public"]["Tables"]["bookings"]["Row"];

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type Booking = Omit<BookingRow, "status"> & {
  status: BookingStatus;
};

export type BookingDates = Pick<Booking, "check_in" | "check_out">;

export type BookingInput = Pick<
  Booking,
  "guest_name" | "guest_email" | "check_in" | "check_out" | "guests"
> & {
  status?: BookingStatus;
};
