import * as React from "react";

import { Button } from "@/components/ui/button";
import { useClickAway } from "@uidotdev/usehooks";
import { MeetingResponse } from "@/features/meeting/queries/get-schedule";
import { useDeleteMeeting } from "@/features/meeting/queries/delete-meeting";
import { Delete } from "lucide-react";

type Props = {
  m: MeetingResponse[0];
};

export function ScheduleItem({ m }: Props) {
  return (
    <div className="space-y-2">
      {m.timeSlots.map((ts, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <p>{ts.timeSlot}</p>
          <div className="inline-flex itm flex-wrap gap-2">
            {ts.meetings
              .sort((a, b) =>
                a.studentNickname
                  .toLowerCase()
                  .localeCompare(b.studentNickname.toLowerCase()),
              )
              .map((mt, i) => (
                <StudentName
                  key={mt.id}
                  meetingId={mt.id}
                  nickname={mt.studentNickname}
                  isAddComma={i !== ts.meetings.length - 1}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

interface StudentNameProps {
  meetingId: number;
  nickname: string;
  isAddComma: boolean;
}

function StudentName({ meetingId, nickname, isAddComma }: StudentNameProps) {
  const [isShowIcon, setSetIsShowIcon] = React.useState(false);
  const mutation = useDeleteMeeting();
  const ref = useClickAway<HTMLDivElement>(() => {
    setSetIsShowIcon(false);
  });

  function onDelete() {
    mutation.mutate({ id: meetingId });
  }

  const handleToggleDeleteBtn = () => {
    setSetIsShowIcon(!isShowIcon);
  };

  return (
    <div
      ref={ref}
      onClick={handleToggleDeleteBtn}
      className="inline-flex items-center cursor-pointer"
    >
      {nickname}
      {isShowIcon && (
        <Button onClick={onDelete} size="icon" variant="ghost">
          <Delete />
        </Button>
      )}
      {isAddComma ? "," : ""}
    </div>
  );
}
