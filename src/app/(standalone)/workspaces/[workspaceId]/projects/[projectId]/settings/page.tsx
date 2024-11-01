import { getCurrent } from "@/features/auth/queries";
import { EditProjectForm } from "@/features/projects/components/edit-project-form";
import { getProject } from "@/features/projects/queries";
import { redirect } from "next/navigation";

interface ProjectIdSettingsProps {
   params: {
      projectId: string;
   };
};

const ProjectIdSettings = async ( { 
   params
} : ProjectIdSettingsProps ) => {
   const user= await getCurrent()
   if(!user) redirect("/sign-in");

   const initalValues = await getProject({
      projectId: params.projectId,
   });

   if(!initalValues) return null

   return (
      <div className="w-full lg:m">
         <EditProjectForm initialValues={initalValues}/>
      </div>
   );
};

export default ProjectIdSettings;