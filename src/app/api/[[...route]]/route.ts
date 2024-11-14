import { Hono } from "hono";
import { handle } from "hono/vercel";

import students from "@/features/students/route";
import programs from "@/features/programs/route";
import enrollments from "@/features/enrollment/route";
import packages from "@/features/meeting-package/route";
import products from "@/features/products/route";

const app = new Hono().basePath("/api");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .route("/students", students)
  .route("/enrollement", enrollments)
  .route("/programs", programs)
  .route("/packages", packages)
  .route("/products", products);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
