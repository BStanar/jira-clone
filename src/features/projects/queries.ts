
import { getMember } from "@/features/members/utils";
import { DATABASE_ID, PROJECTS_ID } from "@/config";
import { createSessionClient } from "@/lib/appwrite";
import { Project } from "./types";

interface getProjectProps {
   projectId: string
}

export const getProject = async ({projectId}: getProjectProps) => {
   const { account, databases } = await createSessionClient();
   const user = await account.get();
   const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId,
   );

   const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId: project.workspaceId,
   });

   if (!member){
      return null;
   }
   
   return project;
};