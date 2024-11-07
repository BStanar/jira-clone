import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/use-confirm";
import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useDeleteTask } from "../api/use-delete-task";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useEditTaskModal } from "../hooks/use-edit-task-modal";

interface TaskActionProps {
   id: string;
   projectId: string;
   children: React.ReactNode;
};

export const TaskAction = ({
   id,
   projectId,
   children,
} : TaskActionProps) => {

   const router = useRouter();

   const {open} = useEditTaskModal();

   const workspaceId = useWorkspaceId();

   const [Confirmdialog, cofirm] = useConfirm(
      "Delete task",
      "This action cannot be undone.",
      "destructive"
   );

   const { mutate, isPending } = useDeleteTask();

   const onDelete = async () => {
      const ok = await confirm ();
      if(!ok) return;

      mutate ({ param: { taskId: id }})
   }

   const onOpenTask = () => {
      router.push(`/workspaces/${workspaceId}/tasks/${id}`);
   }

   const onOpenProject = () => {
      router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
   }

   return(
      <div className="flex justify-end">
         <Confirmdialog/>
         <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
               {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
               <DropdownMenuItem
                  onClick={onOpenTask}
                  className="font-medium p-[10px]"
               >
                  <ExternalLinkIcon className="size-4 stroke-2 mr-2"/>
                  Task Details
               </DropdownMenuItem>
               <DropdownMenuItem
                  onClick={onOpenProject}
                  className="font-medium  p-[10px]"
               >
                  <ExternalLinkIcon className="size-4 stroke-2 mr-2"/>
                  Open project
               </DropdownMenuItem>
               <DropdownMenuItem
                  onClick={()=> open(id)}
                  className="font-medium p-[10px]"
               >
                  <PencilIcon className="size-4 stroke-2 mr-2"/>
                  Edit task
               </DropdownMenuItem>
               <DropdownMenuItem
                  onClick={onDelete}
                  disabled={isPending}
                  className="font-medium text-amber-700 focus:text-amber-700 p-[10px]"
               >
                  <TrashIcon className="size-4 stroke-2 mr-2"/>
                  Delete task
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
   );
};