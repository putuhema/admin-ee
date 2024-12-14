import React from "react";
import TeacherAvatar from "./teacher-avatar";
import { MeetingType } from "@/db/schema";
import { AlarmClockCheck, Check, Ellipsis, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MeetingDateData } from "../../queries/get-meeting-by-date";
import { useCompleteMeeting } from "../../queries/patch-completed-meeting";

interface CurrentTeacherProps {
  status: string;
  meetings: MeetingDateData[0]["programGroups"][0]["details"];
}

export const PROGRESS = {
  inprogress: "sedang",
  completed: "selesai",
  scheduled: "akan",
  cancelled: "dibatalkan",
  postponed: "ditunda",
} as const;

export default function CurrentTeacher({
  meetings,
  status,
}: CurrentTeacherProps) {
  const { mutate } = useCompleteMeeting();
  const latestMeeting = meetings[meetings.length - 1];

  const handleCompletedMeeting = () => {
    mutate({
      meetingIds: meetings.map((m) => m.id),
    });
  };

  return (
    <div className="flex gap-4 justify-between items-center">
      <TeacherAvatar />
      <div>
        <p className="text-xs text-muted-foreground">
          {PROGRESS[status as keyof typeof PROGRESS]} diajar
        </p>
        <p className="capitalize overflow-hidden text-ellipsis">
          Mr. {latestMeeting.tutorName?.split(" ")[0]}
        </p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button disabled={status === "completed"} size="icon" variant="ghost">
            {status === "completed" ? <Check /> : <Ellipsis />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleCompletedMeeting}>
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
