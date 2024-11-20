import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  tutorId: string;
  tutorName: string;
};

export function MeetingTeacherCell({ tutorId, tutorName }: Props) {
  return tutorName ? (
    <div className="flex items-center gap-2">
      <Avatar className="h-6 w-6">
        <AvatarImage src="https://github.com/putuhema.png" />
        <AvatarFallback>PT</AvatarFallback>
      </Avatar>
      <p className="capitalize">{tutorName}</p>
    </div>
  ) : (
    <div>-</div>
  );
}
