import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import { Task , TaskStatus} from "../types";
import React, { useCallback, useEffect, useState } from "react";
import { KanbanColumnHeader } from "./kanban-column-header";
import { KanbanCard } from "./kanban-card";

interface DataKanbanProps {
   data: Task[];  
   onChange:   ( tasks: {
                     $id: string;
                     status: TaskStatus;
                     position: number;
                  }[]
               )=>void;
};

const boards: TaskStatus[] = [
   TaskStatus.BACKLOG,
   TaskStatus.TODO,
   TaskStatus.IN_PROGRESS,
   TaskStatus.IN_REVIEW,
   TaskStatus.DONE,
];

type TaskState = {
   [key in TaskStatus]: Task[];
};

export const DataKanban = ({
   data,
   onChange,
}: DataKanbanProps) => {

   const [tasks, setTasks] = useState<TaskState>(()=>{
      const initialTasks: TaskState = {
         [TaskStatus.BACKLOG]: [],
         [TaskStatus.TODO]: [],
         [TaskStatus.IN_PROGRESS]: [],
         [TaskStatus.IN_REVIEW]: [],
         [TaskStatus.DONE]: [],
      };

      data.forEach((task) =>{
         initialTasks[task.status].push(task);
      });

      Object.keys(initialTasks).forEach((status) => {
         initialTasks[status as TaskStatus].sort((a,b) => a.position-b.position);
      });

      return initialTasks;
   });

   useEffect( (  ) => { 
      const newTasks: TaskState = {
         [TaskStatus.BACKLOG]: [],
         [TaskStatus.TODO]: [],
         [TaskStatus.IN_PROGRESS]: [],
         [TaskStatus.IN_REVIEW]: [],
         [TaskStatus.DONE]: [],
      };

      data.forEach((task) =>{
         newTasks[task.status].push(task);
      });

      Object.keys(newTasks).forEach((status) => {
         newTasks[status as TaskStatus].sort((a,b) => a.position-b.position);
      });
      setTasks(newTasks);
    } , [data] );

   const onDragEnd = useCallback((result: DropResult) => {
  if (!result.destination) return;

  const { source, destination } = result;
  const sourceStatus = source.droppableId as TaskStatus;
  const destStatus = destination.droppableId as TaskStatus;

  let updatesPayload: { $id: string; status: TaskStatus; position: number }[] = [];

  setTasks((previousTasks) => {
    const newTasks = { ...previousTasks };

    // Safely remove the task from the source column
    const sourceColumn = [...newTasks[sourceStatus]];
    const [movedTask] = sourceColumn.splice(source.index, 1);

    // If there is no moved task, return previous instance
    if (!movedTask) {
      console.error("No task found at the source index");
      return previousTasks;
    }

    // Create a new task object with potentially updated status
    const updatedMovedTask = sourceStatus !== destStatus ? { ...movedTask, status: destStatus } : movedTask;

    // Update the source column
    newTasks[sourceStatus] = sourceColumn;

    const destColumn = [...newTasks[destStatus]];
    destColumn.splice(destination.index, 0, updatedMovedTask);

    newTasks[destStatus] = destColumn;

    // Prepare minimal update payloads
    updatesPayload = [];

    // Update the position of the moved task
    updatesPayload.push({
      $id: updatedMovedTask.$id,
      status: destStatus,
      position: Math.min((destination.index + 1) * 1000, 1_000_000),
    });

    // Update positions for all tasks in the destination column
    newTasks[destStatus].forEach((task, index) => {
      const newPosition = Math.min((index + 1) * 1000, 1_000_000);
      if (task.position !== newPosition) {
        updatesPayload.push({
          $id: task.$id,
          status: destStatus,
          position: newPosition,
        });
      }
    });

    // If the task moved between columns, update positions in the source column
    if (sourceStatus !== destStatus) {
      newTasks[sourceStatus].forEach((task, index) => {
        const newPosition = Math.min((index + 1) * 1000, 1_000_000);
        if (task.position !== newPosition) {
          updatesPayload.push({
            $id: task.$id,
            status: sourceStatus,
            position: newPosition,
          });
        }
      });
    }

    return newTasks;
  });
  onChange(updatesPayload);
}, []);
   return(
      <DragDropContext onDragEnd={onDragEnd}>
         <div className="flex overflow-x-auto">
            {boards.map((board)=> {
               return(
                  <div key={board} className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]">
                     <KanbanColumnHeader
                        board={board}
                        taskCount={tasks[board].length}
                     />
                     <Droppable key={board} droppableId={board}>
                        {(provided) => (
                           <div
                              {...provided.droppableProps}
                              ref= {provided.innerRef}
                              className="min-h-[200px] py-1.5"
                           >
                              {tasks[board].map((task, index) => (
                                 <Draggable
                                    key={task.$id}
                                    draggableId={task.$id}
                                    index={index}
                                 >
                                    {(provided) => (
                                       <div
                                       ref={provided.innerRef}
                                       {...provided.draggableProps}
                                       {...provided.dragHandleProps}
                                       >
                                          <KanbanCard task={task}/>
                                       </div>
                                    )}
                                 </Draggable>
                              ))}
                              {provided.placeholder}
                           </div>
                        )}
                     </Droppable>
                  </div>
               )
            })}
         </div>
      </DragDropContext>
   );
}