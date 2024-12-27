import { Hono } from "hono";
import { handle } from "hono/vercel";
import { auth } from "@/lib/auth";

import students from "@/features/students/route";
import programs from "@/features/programs/route";
import enrollments from "@/features/enrollment/route";
import packages from "@/features/meeting-package/route";
import products from "@/features/products/route";
import meetings from "@/features/meeting/route";
import teachers from "@/features/teachers/route";
import payments from "@/features/payments/route";
import bookPreparations from "@/features/book-preparations/route";
import invoices from "@/features/invoices/route";

export type Variables = {
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
};

const app = new Hono<Variables>().basePath("/api");

app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return await next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return await next();
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .route("/students", students)
  .route("/enrollments", enrollments)
  .route("/programs", programs)
  .route("/packages", packages)
  .route("/products", products)
  .route("/meetings", meetings)
  .route("/teachers", teachers)
  .route("/payments", payments)
  .route("/book-preparations", bookPreparations)
  .route("/invoices", invoices);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
