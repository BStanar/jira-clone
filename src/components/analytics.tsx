import { ProjectAnalyticsResponseType } from "@/features/projects/api/use-get-project-analytics";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { AnalyticsCard } from "./analytics-card";
import { DottedSeparator } from "./dotted-separator";

export const ProjectAnalytics = ({data}: ProjectAnalyticsResponseType) => {
   if(!data) return null;

   return(
      <ScrollArea className="border rounder-lg w-full whitespace-nowrap shrink-0">
         <div className="w-full flex flex-row">
            <div className="flex items-center flex-1">
               <AnalyticsCard 
                  title={"Total tasks"}
                  value={data.taskCount}
                  variant={data.taskDifference > 0 ? "up":"down"}
                  increaseValue={data.taskDifference}
               />
					<DottedSeparator direction="vertical" />
            </div>
            <div className="flex items-center flex-1">
               <AnalyticsCard 
                  title={"Assigned tasks"}
                  value={data.assignedTaskCount}
                  variant={data.assignedTaskDifferance > 0 ? "up":"down"}
                  increaseValue={data.assignedTaskDifferance}
               />
					<DottedSeparator direction="vertical" />
            </div>
            <div className="flex items-center flex-1">
               <AnalyticsCard 
                  title={"Completed tasks"}
                  value={data.completeTaskCount}
                  variant={data.completeTaskDifferance > 0 ? "up":"down"}
                  increaseValue={data.completeTaskDifferance}
               />
					<DottedSeparator direction="vertical" />
            </div>
            <div className="flex items-center flex-1">
               <AnalyticsCard 
                  title={"Overdue tasks"}
                  value={data.OverdueTaskCount}
                  variant={data.OverdueTaskDifferance < 0 ? "up":"down"}
                  increaseValue={data.OverdueTaskDifferance}
               />
					<DottedSeparator direction="vertical" />
            </div>
            <div className="flex items-center flex-1">
               <AnalyticsCard 
                  title={"Incomplete tasks"}
                  value={data.OverdueTaskCount}
                  variant={data.OverdueTaskDifferance > 0 ? "up":"down"}
                  increaseValue={data.OverdueTaskDifferance}
               />
					<DottedSeparator direction="vertical" />
            </div>
         </div>
         <ScrollBar orientation="horizontal"/>
      </ScrollArea>
   );
};