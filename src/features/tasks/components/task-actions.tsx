import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react";

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

   return(
      <div className="flex justify-end">
         <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
               {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
               <DropdownMenuItem
                  onClick={()=> {}}
                  disabled={false}
                  className="font-medium p-[10px]"
               >
                  <ExternalLinkIcon className="size-4 stroke-2 mr-2"/>
                  Task Details
               </DropdownMenuItem>
               <DropdownMenuItem
                  onClick={()=> {}}
                  disabled={false}
                  className="font-medium  p-[10px]"
               >
                  <ExternalLinkIcon className="size-4 stroke-2 mr-2"/>
                  Open project
               </DropdownMenuItem>
               <DropdownMenuItem
                  onClick={()=> {}}
                  disabled={false}
                  className="font-medium p-[10px]"
               >
                  <PencilIcon className="size-4 stroke-2 mr-2"/>
                  Edit task
               </DropdownMenuItem>
               <DropdownMenuItem
                  onClick={()=> {}}
                  disabled={false}
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