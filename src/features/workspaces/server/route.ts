import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { sessionMiddleWare } from "@/lib/session-middleware";

import { createWorkspacesSchema } from "../schema";

import { DATABASE_ID, WORKSPACES_ID } from "@/config";
import { ID } from "node-appwrite";

const app = new Hono()
    .post(
        "/",
        zValidator("json",createWorkspacesSchema),
        sessionMiddleWare,
        async (c) =>{
            const databases = c.get("databases");
            const user = c.get("user");
            const { name }= c.req.valid("json");

            const workspace = await databases.createDocument(
                DATABASE_ID,
                WORKSPACES_ID,
                ID.unique(),
                {
                    name,
                    userId: user.$id,
                },
            );
            return c.json({data:workspace})
        }
    );

export default app;