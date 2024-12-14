import React from "react";
import TeacherAvatar from "./teacher-avatar";
import { MeetingType } from "@/db/schema";
import { AlarmClockCheck, Ellipsis, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CurrentTeacherProps {
  status: MeetingType["status"];
  tutorName: string;
}

export const PROGRESS = {
  inprogress: "sedang",
  completed: "selesai",
  scheduled: "akan",
  cancelled: "dibatalkan",
  postponed: "ditunda",
} as const;

export default function CurrentTeacher({
  status,
  tutorName,
}: CurrentTeacherProps) {
  return (
    <div className="flex gap-4 justify-between items-center">
      <TeacherAvatar />
      <div>
        <p className="text-xs text-muted-foreground">
          {PROGRESS[status!]} diajar
        </p>
        <p className="capitalize overflow-hidden text-ellipsis">
          Mr. {tutorName?.split(" ")[0]}
        </p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost">
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <AlarmClockCheck /> Completed
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Send /> Transfer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
