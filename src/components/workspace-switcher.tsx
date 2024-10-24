"use client"

import { useRouter } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";

import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { WorkspaceAvatar } from "@/features/workspaces/components/workspace-avatar";

import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "./ui/select";
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";



export const WorkspaceSwitcher = () => {

    //Used for getting the current workspace if in wokrspaces page
    const workspaceId = useWorkspaceId();
    //Used for switching to a workspace page
    const router = useRouter();

    //get workspace data from db
    const { data: workspaces }= useGetWorkspaces();
    
    const {open} = useCreateWorkspaceModal();

    const onSelect=(id: string)=>{
        router.push(`/workspaces/${id}`);
    };

    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
                <p className="text-xs uppercase text-neutral-500">Workspaces</p>
                <RiAddCircleFill onClick={open} className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"></RiAddCircleFill>
            </div>
            <Select onValueChange={onSelect} value={workspaceId}>
                <SelectTrigger className="w-full bg-neutral-200 font-medium pt-5 pb-5">
                    <SelectValue placeholder="No workspace selected"/>
                </SelectTrigger>
                <SelectContent>
                    {workspaces?.documents.map(( workspace )=> (
                        <SelectItem key={workspace.$id} value={workspace.$id}>
                            <div className="flex justify-start items-center gap-3 font-medium">
                                <WorkspaceAvatar name={workspace.name} image={workspace.imageUrl}/>      
                                <span className="truncate">{workspace.name}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};