import { DATABASE_ID, WORKSPACES_ID } from "@/config";
import { AUTH_COOKIE } from "@/features/auth/constants";
import { getCurrent } from "@/features/auth/queries";
import { getMember } from "@/features/members/utils";
import { getWorkspaceInfo } from "@/features/workspaces/actions";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";
import { Workspace } from "@/features/workspaces/types";
import { createSessionClient } from "@/lib/appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Account, Client, Databases } from "node-appwrite";
import { TbArrowWaveLeftDown } from "react-icons/tb";

interface WorkspaceIdJoinPageProps {
    params: {
        workspaceId: string;
    };
};

const WorkspaceIdJoinPage = async ({
    params,
}:WorkspaceIdJoinPageProps) => { 
    //Protect page
    const user = await getCurrent();
    if(!user) redirect("/sign-in");

    const initialValues = await getWorkspaceInfo({
        workspaceId: params.workspaceId,
    });

    if(!initialValues){
        redirect("/");
    }

    return (
        <div className="w-full lg:max-w-xl">
            <JoinWorkspaceForm initialValues={initialValues}/>
        </div>
    );
};

export default WorkspaceIdJoinPage;
