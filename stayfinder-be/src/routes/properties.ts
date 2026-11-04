import { Hono } from "hono";

import { requireAuth } from "../middleware/auth.js";
import {
  propertyCreateValidator,
  propertyIdValidator,
  propertyQueryValidator,
  propertyUpdateValidator,
} from "../validators/propertyValidator.js";
import {
  createProperty,
  deleteProperty,
  getPropertyById,
  listProperties,
  updateProperty,
} from "../database/properties.js";

const properties = new Hono({ strict: false });

properties.get("/", propertyQueryValidator, async (c) => {
  const query = c.req.valid("query");

  try {
    const result = await listProperties(c.get("supabase"), query);
    return c.json(result, 200);
  } catch (error) {
    console.error("Could not fetch properties", error);
    return c.json({ error: "Could not fetch properties" }, 500);
  }
});

properties.get("/:id", propertyIdValidator, async (c) => {
  const { id } = c.req.valid("param");

  try {
    const property = await getPropertyById(c.get("supabase"), id);

    if (!property) {
      return c.json({ error: "Property not found" }, 404);
    }

    return c.json(property, 200);
  } catch (error) {
    console.error("Could not fetch property", error);
    return c.json({ error: "Could not fetch property" }, 500);
  }
});

properties.post("/", requireAuth, propertyCreateValidator, async (c) => {
  const body = c.req.valid("json");
  const user = c.get("user")!;

  try {
    const property = await createProperty(c.get("supabase"), user.id, body);
    return c.json(property, 201);
  } catch (error) {
    console.error("Could not create property", error);
    return c.json({ error: "Could not create property" }, 500);
  }
});

properties.patch("/:id", requireAuth, propertyIdValidator, propertyUpdateValidator, async (c) => {
  const { id } = c.req.valid("param");
  const changes = c.req.valid("json");

  try {
    const property = await updateProperty(c.get("supabase"), id, changes);

    if (!property) {
      return c.json({ error: "Property not found" }, 404);
    }

    return c.json(property, 200);
  } catch (error) {
    console.error("Could not update property", error);
    return c.json({ error: "Could not update property" }, 500);
  }
});

properties.delete("/:id", requireAuth, propertyIdValidator, async (c) => {
  const { id } = c.req.valid("param");

  try {
    const property = await deleteProperty(c.get("supabase"), id);

    if (!property) {
      return c.json({ error: "Property not found" }, 404);
    }

    return c.json({ message: "Property deleted" }, 200);
  } catch (error) {
    console.error("Could not delete property", error);
    return c.json({ error: "Could not delete property" }, 500);
  }
});

export default properties;