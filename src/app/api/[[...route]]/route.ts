import { Hono } from "hono";
import { handle } from "hono/vercel";

import auth from "@/features/auth/server/route";
import workspaces from "@/features/workspaces/server/route";

const app = new Hono().basePath("/api");

const routes = app.route("/auth", auth) // eslint-disable-line @typescript-eslint/no-unused-vars
   .route("/workspaces", workspaces);


export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;