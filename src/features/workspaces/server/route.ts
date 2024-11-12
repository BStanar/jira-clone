import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ID, Query } from "node-appwrite";

import { MemberRole } from "@/features/members/types";
import { getMember } from "@/features/members/utils";

import { sessionMiddleWare } from "@/lib/session-middleware";
import { generateInviteCode } from "@/lib/utils";
import { DATABASE_ID, IMAGES_BUCKET_ID, MEMBERS_ID, TASKS_ID, WORKSPACES_ID } from "@/config";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";

import { Workspace } from "../types";
import { createWorkspacesSchema, updateWorkspaceSchema } from "../schema";
import { TaskStatus } from "@/features/tasks/types";

const app = new Hono()
    .get(
        "/", 
        sessionMiddleWare, 
        async (c)=>{
            const user = c.get("user");
            const databases=c.get("databases");

            const members = await databases.listDocuments(
                DATABASE_ID,
                MEMBERS_ID,
                [Query.equal("userId",user.$id)]
            );

            const workspaceIds= members.documents.map ((member) => member.workspaceId);

            if (members.total === 0){
                return c.json({data : { documents: [], total: 0 } });
            }

            const workspaces = await databases.listDocuments(
                DATABASE_ID,
                WORKSPACES_ID,
                [
                    Query.orderDesc("$createdAt"),
                    Query.contains("$id", workspaceIds)
                ],
            );

            return c.json({data: workspaces});
        }
    ).get(
        "/:workspaceId", 
        sessionMiddleWare, 
        async (c)=>{
            const user = c.get("user");
            const databases = c.get("databases");
            const { workspaceId } = c.req.param();

            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id,
            });

            if(!member){
                return c.json({error: "Unauthorized"}, 401);
            }

            const workspace = await databases.getDocument<Workspace>(
                DATABASE_ID,
                WORKSPACES_ID,
                workspaceId,
            );

             return c.json({data: workspace});
        }
    ).get(
        "/:workspaceId/info", 
        sessionMiddleWare, 
        async (c)=>{
            const databases = c.get("databases");
            const { workspaceId } = c.req.param();

            const workspace = await databases.getDocument<Workspace>(
                DATABASE_ID,
                WORKSPACES_ID,
                workspaceId,
            );

            return c.json({data: {
                $id: workspace.$id, 
                name: workspace.name, 
                image: workspace.imageUrl
            }});
        }
    ).post(
        "/",
        zValidator("form",createWorkspacesSchema),
        sessionMiddleWare,
        async (c) =>{
            const databases = c.get("databases");
            const user = c.get("user");
            const storage = c.get("storage");

            const { name, image}= c.req.valid("form");

            let uploadedImageUrl: string | undefined;

            if( image instanceof File ){
                const file = await storage.createFile(
                    IMAGES_BUCKET_ID,
                    ID.unique(),
                    image,
                );

                const arrayBuffer = await storage.getFilePreview(
                    IMAGES_BUCKET_ID,
                    file.$id,
                );

                uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
            }

            const workspace = await databases.createDocument(
                DATABASE_ID,
                WORKSPACES_ID,
                ID.unique(),
                {
                    name,
                    userId: user.$id,
                    imageUrl: uploadedImageUrl,
                    inviteCode: generateInviteCode(10),
                },
            );

            await databases.createDocument(
                DATABASE_ID,
                MEMBERS_ID,
                ID.unique(),
                {
                    userId:user.$id,
                    workspaceId: workspace.$id,
                    role: MemberRole.ADMIN,
                },
            );

            return c.json({data:workspace})
        }
    ).patch(
        "/:workspaceId",
        sessionMiddleWare,
        zValidator("form", updateWorkspaceSchema),
        async (c) => {
            const databases = c.get("databases");
            const storage = c.get("storage");
            const user = c.get("user");
        
        
            const {workspaceId} = c.req.param();
            const {name, image} = c.req.valid("form");
        
            const member = await getMember({
				databases,
				workspaceId,
				userId: user.$id,
			});

            if (!member || member.role !== MemberRole.ADMIN) {
				return c.json({ error: "Unauthorized" }, 401);
			}

            let uploadedImageUrl: string | undefined;

            if( image instanceof File ){
                const file = await storage.createFile(
                    IMAGES_BUCKET_ID,
                    ID.unique(),
                    image,
                );

                const arrayBuffer = await storage.getFilePreview(
                    IMAGES_BUCKET_ID,
                    file.$id,
                );

                uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
            } else {
                uploadedImageUrl = image;
            }

            const workspace= await databases.updateDocument(
                DATABASE_ID,
                WORKSPACES_ID,
                workspaceId,
                {
                    name,
                    imageUrl: uploadedImageUrl
                }
            );
            return c.json({data: workspace});
        }
    ).delete(
        "/:workspaceId",
        sessionMiddleWare,
        async (c) => {
            const databases = c.get("databases");
            const user = c.get("user");

            const { workspaceId } = c.req.param();

            const member = await getMember({
				databases,
				workspaceId,
				userId: user.$id,
			});

            if(!member || member.role !== MemberRole.ADMIN){
               return c.json({error: "unauthorizedkkkkk"}, 401); 
            }
            
            //TODO: DELETE MEMBERS, PROJECTS AND TASKS
            await databases.deleteDocument(
                DATABASE_ID,
                WORKSPACES_ID,
                workspaceId,
            );

            return c.json({data: {$id: workspaceId}});
        }
    ).post(
        "/:workspaceId/reset-invite-code",
        sessionMiddleWare,
        async (c) => {
            const databases = c.get("databases");
            const user = c.get("user");

            const { workspaceId } = c.req.param();

            //ONLY ADMINS CAN RESET INVITE CODE
            const member = await getMember({
				databases,
				workspaceId,
				userId: user.$id,
			});

            if(!member || member.role !== MemberRole.ADMIN){
               return c.json({error: "unauthorizedkkkkk"}, 401); 
            }
            
            const workspace = await databases.updateDocument(
                DATABASE_ID,
                WORKSPACES_ID,
                workspaceId,
                {
                    inviteCode: generateInviteCode(10),
                }
            );

            return c.json({data: workspace});
        }
    ).post(
        "/:workspaceId/join",
        sessionMiddleWare,
        zValidator("json", z.object({ code: z.string()})),
        async (c) => {
            const { workspaceId } = c.req.param();
            const { code } = c.req.valid("json");

            const databases = c.get("databases");
            const user = c.get("user");

            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id,
            });

            if(member) {
                return c.json({ error: "Allready a member"}, 400);
            }

            const workspace = await databases.getDocument<Workspace>(
                DATABASE_ID,
                WORKSPACES_ID,
                workspaceId,
            );

            if (workspace.inviteCode !== code) {
                return c.json({error: "Invalid invite code"}, 400);
            }

            await databases.createDocument(
                DATABASE_ID,
                MEMBERS_ID,
                ID.unique(),
                {
                    workspaceId,
                    userId: user.$id,
                    role: MemberRole.MEMBER,
                },
            );

            return c.json({data: workspace});
        }
    ).get(
        "/:workspaceId/analytics",
        sessionMiddleWare,
        async (c) => {
           const databases = c.get("databases");
           const user = c.get("user");
           const { workspaceId } = c.req.param();
     
           const member = await getMember({
              databases,
              workspaceId,
              userId: user.$id,
           });
     
           if(!member){
              return c.json({error: "Unauthorized"}, 401);
           }
     
           const now = new Date();
           const thisMonthStart = startOfMonth(now);      
           const thisMonthEnd = endOfMonth(now);      
           const lastMonthStart = startOfMonth(subMonths(now,1));      
           const lastMonthEnd = endOfMonth(subMonths(now,1));  
     
           const thisMonthTasks = await databases.listDocuments(
              DATABASE_ID,
              TASKS_ID,
              [
                 Query.equal("workspaceId", workspaceId),
                 Query.greaterThan("$createdAt", thisMonthStart.toISOString()),
                 Query.lessThan("$createdAt", thisMonthEnd.toISOString()),
              ]
           );
     
           const lastMonthTasks = await databases.listDocuments(
              DATABASE_ID,
              TASKS_ID,
              [
                 Query.equal("workspaceId", workspaceId),
                 Query.greaterThan("$createdAt", lastMonthStart.toISOString()),
                 Query.lessThan("$createdAt", lastMonthEnd.toISOString()),
              ]
           );
     
           const taskCount = thisMonthTasks.total;
           const taskDifference = taskCount - lastMonthTasks.total;
     
           const thisMonthAssignedTasks = await databases.listDocuments(
              DATABASE_ID,
              TASKS_ID,
              [
                 Query.equal("workspaceId", workspaceId),
                 Query.equal("assigneeId", member.$id),
                 Query.greaterThan("$createdAt", thisMonthStart.toISOString()),
                 Query.lessThan("$createdAt", thisMonthEnd.toISOString()),
              ]
           );
           const lastMonthAssignedTasks = await databases.listDocuments(
              DATABASE_ID,
              TASKS_ID,
              [
                 Query.equal("workspaceId", workspaceId),
                 Query.equal("assigneeId", member.$id),
                 Query.greaterThan("$createdAt", lastMonthStart.toISOString()),
                 Query.lessThan("$createdAt", lastMonthEnd.toISOString()),
              ]
           );
     
           const assignedTaskCount = thisMonthAssignedTasks.total;
           const assignedTaskDifferance = assignedTaskCount - lastMonthAssignedTasks.total;
     
           const thisMonthIncompleteTasks = await databases.listDocuments(
                 DATABASE_ID,
                 TASKS_ID,
                 [
                     Query.equal("workspaceId", workspaceId),
                     Query.notEqual("status", TaskStatus.DONE),
                     Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
                     Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
                 ]
             );
     
           const lastMonthIncompleteTasks = await databases.listDocuments(
                 DATABASE_ID,
                 TASKS_ID,
                 [
                     Query.equal("workspaceId", workspaceId),
                     Query.notEqual("status", TaskStatus.DONE),
                     Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
                     Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
                 ]
             );
     
           const incompleteTaskCount = thisMonthIncompleteTasks.total;
           const incompleteTaskDifferance = incompleteTaskCount - lastMonthIncompleteTasks.total;
     
           const thisMonthCompleteTasks = await databases.listDocuments(
                 DATABASE_ID,
                 TASKS_ID,
                 [
                     Query.equal("workspaceId", workspaceId),
                     Query.equal("status", TaskStatus.DONE),
                     Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
                     Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
                 ]
             );
     
           const lastMonthCompleteTasks = await databases.listDocuments(
                 DATABASE_ID,
                 TASKS_ID,
                 [
                     Query.equal("workspaceId", workspaceId),
                     Query.equal("status", TaskStatus.DONE),
                     Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
                     Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
                 ]
             );
     
           const completeTaskCount = thisMonthIncompleteTasks.total;
           const completeTaskDifferance = completeTaskCount - lastMonthCompleteTasks.total;
     
           const thisMonthOverdueTasks = await databases.listDocuments(
                 DATABASE_ID,
                 TASKS_ID,
                 [
                     Query.equal("workspaceId", workspaceId),
                     Query.notEqual("status", TaskStatus.DONE),
                     Query.lessThan("dueDate", now.toISOString()),
                     Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
                     Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
                 ]
             );
     
           const lastMonthOverdueTasks = await databases.listDocuments(
                 DATABASE_ID,
                 TASKS_ID,
                 [
                     Query.equal("workspaceId", workspaceId),
                     Query.notEqual("status", TaskStatus.DONE),
                     Query.lessThan("dueDate", now.toISOString()),
                     Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
                     Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
                 ]
             );
     
           const OverdueTaskCount = thisMonthIncompleteTasks.total;
           const OverdueTaskDifferance = completeTaskCount - lastMonthCompleteTasks.total;
     
     
           return c.json({
              data: {
                 taskCount,
                 taskDifference,
                 assignedTaskCount,
                 assignedTaskDifferance,
                 completeTaskCount,
                 completeTaskDifferance,
                 incompleteTaskCount,
                 incompleteTaskDifferance,
                 OverdueTaskCount,
                 OverdueTaskDifferance,
              }
           })
     
        }
     );;

export default app;