import { db } from "@/db";
import { Product } from "@/db/schema";
import { asc } from "drizzle-orm";
import { Hono } from "hono";

const app = new Hono().get("/", async (c) => {
  const products = await db.select().from(Product).orderBy(asc(Product.name));

  return c.json(products, 200);
});

export default app;
