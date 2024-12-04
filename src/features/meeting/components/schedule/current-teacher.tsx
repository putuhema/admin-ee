import React from "react";
import TeacherAvatar from "./teacher-avatar";
import { MeetingType } from "@/db/schema";
import { Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CurrentTeacherProps {
  status: MeetingType["status"];
  tutorName: string;
}

const PROGRESS = {
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

      <Popover>
        <PopoverTrigger asChild>
          <Button size="icon" variant="ghost">
            <Ellipsis />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end">
          Place content for the popover here.
        </PopoverContent>
      </Popover>
    </div>
  );
}
