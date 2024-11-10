import { db } from "@/db";
import { ProductCategory } from "@/db/schema";
import { Hono } from "hono";

const app = new Hono().get("/category", async (c) => {
  const productCategory = await db
    .select({
      id: ProductCategory.id,
      name: ProductCategory.name,
    })
    .from(ProductCategory);

  return c.json(productCategory);
});

export default app;
