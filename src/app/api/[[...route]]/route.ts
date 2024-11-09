import { Hono } from "hono";
import { handle } from "hono/vercel";

import subjects from "@/features/subjects/route";
import students from "@/features/students/route";
import enrollements from "@/features/enrollment/route";

const app = new Hono().basePath("/api");

const routes = app
  .route("/subjects", subjects)
  .route("/students", students)
  .route("/enrollement", enrollements);

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;
