import type { Database } from "./database.types.js";

type BookingTable = Database["public"]["Tables"]["bookings"];

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type Booking = Omit<BookingTable["Row"], "status"> & {
  status: BookingStatus;
};

export type NewBooking = Pick<
  BookingTable["Insert"],
  "guest_name" | "guest_email" | "check_in" | "check_out" | "guests"
>;

export type BookingUpdate = Partial<NewBooking> & {
  status?: BookingStatus;
};