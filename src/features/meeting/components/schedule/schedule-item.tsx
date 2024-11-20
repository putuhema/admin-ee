import * as React from "react";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useClickAway } from "@uidotdev/usehooks";
import { MeetingResponse } from "@/features/meeting/queries/get-schedule";
import { useDeleteMeeting } from "@/features/meeting/queries/delete-meeting";
import { Loader2, Trash2 } from "lucide-react";

type Props = {
  meetingId: number;
  m: MeetingResponse[0]["meetings"][0];
  index: number;
};

export function ScheduleItem({ meetingId, m, index }: Props) {
  const [showEditButton, setShowEditButton] = React.useState(false);
  const ref = useClickAway<HTMLDivElement>(() => {
    setShowEditButton(false);
  });
  const mutation = useDeleteMeeting();

  function onDelete(id: number) {
    if (meetingId !== id) return;
    mutation.mutate({ id });
  }

  return (
    <div
      ref={ref}
      onClick={() => {
        setShowEditButton(!showEditButton);
      }}
      className="flex justify-between w-full items-center pr-8 cursor-pointer"
    >
      <div>{m.studentName}</div>
      <div className="flex justify-start items-center gap-1">
        <div>{format(new Date(m.startTime), "hh:mm a")}</div>
        <div>-</div>
        <div>{format(new Date(m.endTime), "hh:mm a")}</div>
        {showEditButton && meetingId === m.id && (
          <div className="flex  items-center ml-2">
            <Button
              disabled={mutation.isPending && meetingId === m.id}
              size="icon"
              onClick={() => {
                onDelete(m.id);
              }}
              variant="ghost"
              className={cn(index % 2 === 0 && "hover:bg-blue-100")}
            >
              {mutation.isPending && meetingId === m.id ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Trash2 className="text-red-500" />
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
