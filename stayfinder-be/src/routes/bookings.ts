import { Hono } from "hono";

import { requireAuth } from "../middleware/auth.js";
import {
  bookingCreateValidator,
  bookingParamValidator,
  bookingPropertyParamValidator,
  bookingUpdateValidator,
} from "../validators/bookingValidator.js";
import {
  createBooking,
  deleteBooking,
  getBookingById,
  listBookingsForProperty,
  updateBooking,
} from "../database/bookings.js";
import { getPropertyById } from "../database/properties.js";

const bookings = new Hono({ strict: false });

bookings.get(
  "/properties/:propertyId/bookings",
  requireAuth,
  bookingPropertyParamValidator,
  async (c) => {
    const { propertyId } = c.req.valid("param");
    const supabase = c.get("supabase");

    try {
      const property = await getPropertyById(supabase, propertyId);

      if (!property) {
        return c.json({ error: "Property not found" }, 404);
      }

      const result = await listBookingsForProperty(supabase, propertyId);
      return c.json(result, 200);
    } catch (error) {
      console.error("Could not fetch bookings", error);
      return c.json({ error: "Could not fetch bookings" }, 500);
    }
  },
);

bookings.post(
  "/properties/:propertyId/bookings",
  requireAuth,
  bookingPropertyParamValidator,
  bookingCreateValidator,
  async (c) => {
    const { propertyId } = c.req.valid("param");
    const body = c.req.valid("json");
    const supabase = c.get("supabase");
    const user = c.get("user")!;

    try {
      const property = await getPropertyById(supabase, propertyId);

      if (!property) {
        return c.json({ error: "Property not found" }, 404);
      }

      const booking = await createBooking(supabase, user.id, propertyId, body);
      return c.json(booking, 201);
    } catch (error) {
      console.error("Could not create booking", error);
      return c.json({ error: "Could not create booking" }, 500);
    }
  },
);

bookings.patch(
  "/bookings/:bookingId",
  requireAuth,
  bookingParamValidator,
  bookingUpdateValidator,
  async (c) => {
    const { bookingId } = c.req.valid("param");
    const changes = c.req.valid("json");
    const supabase = c.get("supabase");

    try {
      const existing = await getBookingById(supabase, bookingId);

      if (!existing) {
        return c.json({ error: "Booking not found" }, 404);
      }

      const checkIn = changes.check_in ?? existing.check_in;
      const checkOut = changes.check_out ?? existing.check_out;

      if (checkOut <= checkIn) {
        return c.json(
          { errors: [{ field: "check_out", message: "Check-out must be after check-in" }] },
          400,
        );
      }

      const booking = await updateBooking(supabase, bookingId, changes);

      if (!booking) {
        return c.json({ error: "Booking not found" }, 404);
      }

      return c.json(booking, 200);
    } catch (error) {
      console.error("Could not update booking", error);
      return c.json({ error: "Could not update booking" }, 500);
    }
  },
);

bookings.delete("/bookings/:bookingId", requireAuth, bookingParamValidator, async (c) => {
  const { bookingId } = c.req.valid("param");

  try {
    const booking = await deleteBooking(c.get("supabase"), bookingId);

    if (!booking) {
      return c.json({ error: "Booking not found" }, 404);
    }

    return c.json({ message: "Booking deleted" }, 200);
  } catch (error) {
    console.error("Could not delete booking", error);
    return c.json({ error: "Could not delete booking" }, 500);
  }
});

export default bookings;