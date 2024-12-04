import React from "react";
import TeacherAvatar from "./teacher-avatar";
import { MeetingType } from "@/db/schema";

interface CurrentTeacherProps {
  status: MeetingType["status"];
  tutorName: string;
}

export default function CurrentTeacher({
  status,
  tutorName,
}: CurrentTeacherProps) {
  const PROGRESS = {
    inprogress: "sedang",
    completed: "selesai",
    scheduled: "akan",
    canceled: "dibatalkan",
    postponed: "ditunda",
  } as const;
  return (
    <div className="flex gap-4 justify-start items-center">
      <TeacherAvatar />
      <div>
        <p className="text-xs text-muted-foreground">
          {PROGRESS[status!]} diajar
        </p>
        <p className="capitalize">Mr. {tutorName?.split(" ")[0]}</p>
      </div>
    </div>
  );
}
