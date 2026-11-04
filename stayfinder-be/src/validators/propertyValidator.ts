import * as z from "zod";
import { zValidator } from "@hono/zod-validator";

import { formatValidationErrors } from "../utils/validation.js";

const propertyBodySchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters"),
  description: z.string().trim().min(3, "Description must be at least 3 characters"),
  location: z.string().trim().min(2, "Location must be at least 2 characters"),
  price_per_night: z.number().int("Price must be a whole number").positive("Price must be greater than 0"),
  max_guests: z.number().int("Max guests must be a whole number").positive("Max guests must be at least 1"),
  kind: z.enum(["apartment", "villa"], 'Kind must be "apartment" or "villa"').optional(),
});

const propertyUpdateSchema = propertyBodySchema
  .partial()
  .refine((body) => Object.keys(body).length > 0, "Send at least one field to update");

const propertyIdSchema = z.object({
  id: z.uuid("Invalid property id"),
});

const propertyQuerySchema = z.object({
  location: z.string().trim().min(1).optional(),
  max_price: z.coerce.number().int().positive("max_price must be greater than 0").optional(),
  guests: z.coerce.number().int().positive("guests must be at least 1").optional(),
  sort: z.enum(["price_asc", "price_desc"], 'sort must be "price_asc" or "price_desc"').optional(),
});

export const propertyCreateValidator = zValidator("json", propertyBodySchema, (result, c) => {
  if (!result.success) {
    return c.json(formatValidationErrors(result.error.issues), 400);
  }
});

export const propertyUpdateValidator = zValidator("json", propertyUpdateSchema, (result, c) => {
  if (!result.success) {
    return c.json(formatValidationErrors(result.error.issues), 400);
  }
});

export const propertyIdValidator = zValidator("param", propertyIdSchema, (result, c) => {
  if (!result.success) {
    return c.json(formatValidationErrors(result.error.issues), 400);
  }
});

export const propertyQueryValidator = zValidator("query", propertyQuerySchema, (result, c) => {
  if (!result.success) {
    return c.json(formatValidationErrors(result.error.issues), 400);
  }
});