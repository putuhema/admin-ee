import { Hono } from "hono";
import { handle } from "hono/vercel";

import subjects from "@/features/subjects/route";
import students from "@/features/students/route";
import enrollements from "@/features/enrollment/route";
import products from "@/features/products/route";

const app = new Hono().basePath("/api");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .route("/subjects", subjects)
  .route("/students", students)
  .route("/enrollement", enrollements)
  .route("/products", products);
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
