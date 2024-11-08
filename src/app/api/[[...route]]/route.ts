import { Hono } from "hono";
import { handle } from "hono/vercel";

import subjects from "@/features/subjects/route";
import students from "@/features/students/route";

const app = new Hono().basePath("/api");

const routes = app.route("/subjects", subjects).route("/students", students);

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;
