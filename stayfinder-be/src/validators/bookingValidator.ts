import * as z from "zod";
import { zValidator } from "@hono/zod-validator";

import { formatValidationErrors } from "../utils/validation.js";

const DATE_ORDER_MESSAGE = "Check-out must be after check-in";

const bookingFields = {
  guest_name: z.string().trim().min(2, "Name must be at least 2 characters"),
  guest_email: z.email("Invalid email"),
  check_in: z.iso.date("Check-in must be a date (YYYY-MM-DD)"),
  check_out: z.iso.date("Check-out must be a date (YYYY-MM-DD)"),
  guests: z.number().int("Guests must be a whole number").positive("Guests must be at least 1"),
};

const bookingCreateSchema = z
  .object(bookingFields)
  .refine((booking) => booking.check_out > booking.check_in, {
    message: DATE_ORDER_MESSAGE,
    path: ["check_out"],
  });

const bookingUpdateSchema = z
  .object(bookingFields)
  .partial()
  .refine((body) => Object.keys(body).length > 0, "Send at least one field to update")
  .refine(
    (body) => !body.check_in || !body.check_out || body.check_out > body.check_in,
    { message: DATE_ORDER_MESSAGE, path: ["check_out"] },
  );

const propertyParamSchema = z.object({
  propertyId: z.uuid("Invalid property id"),
});

const bookingParamSchema = z.object({
  bookingId: z.uuid("Invalid booking id"),
});

export const bookingCreateValidator = zValidator("json", bookingCreateSchema, (result, c) => {
  if (!result.success) {
    return c.json(formatValidationErrors(result.error.issues), 400);
  }
});

export const bookingUpdateValidator = zValidator("json", bookingUpdateSchema, (result, c) => {
  if (!result.success) {
    return c.json(formatValidationErrors(result.error.issues), 400);
  }
});

export const bookingPropertyParamValidator = zValidator("param", propertyParamSchema, (result, c) => {
  if (!result.success) {
    return c.json(formatValidationErrors(result.error.issues), 400);
  }
});

export const bookingParamValidator = zValidator("param", bookingParamSchema, (result, c) => {
  if (!result.success) {
    return c.json(formatValidationErrors(result.error.issues), 400);
  }
});