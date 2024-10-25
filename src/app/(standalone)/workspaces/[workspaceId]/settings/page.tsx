
import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/actions";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form copy";
import { getWorkspace } from "@/features/workspaces/actions";

interface WorkspaceSetingsPageProps {
    params: {
        workspaceId: string;
    };
};

const WorkspaceIdSettingsPage =  async ({
    params,
}: WorkspaceSetingsPageProps) => {
    const user= await getCurrent();
    if (!user) redirect("/sign-in");

    const initialValues = await getWorkspace({workspaceId: params.workspaceId});

    if(!initialValues){
        redirect(`/workspaces/${params.workspaceId}`);
    }
    return (
        <div className="w-full lg:max-w-xl">
            <EditWorkspaceForm initialValues={initialValues}/>
        </div>
    );
};

export default WorkspaceIdSettingsPage;