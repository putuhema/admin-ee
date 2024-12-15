import { formatTime } from "@/lib/utils";
import React from "react";
import { useCompleteMeeting } from "../../queries/patch-completed-meeting";

interface TimerProps {
  meetingIds: number[];
  endTime: Date;
}

export default function Timer({ endTime, meetingIds }: TimerProps) {
  const timerRef = React.useRef<NodeJS.Timeout>();
  const [timeRemaining, setTimeRemaining] = React.useState(() => {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / 1000));
  });
  const { mutate } = useCompleteMeeting();

  React.useEffect(() => {
    if (timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        const now = new Date();
        const diff = endTime.getTime() - now.getTime();
        const newTimeRemaining = Math.max(0, Math.ceil(diff / 1000));

        setTimeRemaining(() => {
          if (newTimeRemaining <= 0) {
            clearInterval(timerRef.current);

            mutate({ meetingIds });

            return 0;
          }
          return newTimeRemaining;
        });
      }, 1000);

      return () => {
        clearInterval(timerRef.current);
      };
    }
  }, [endTime, meetingIds, mutate]);

  return <div className="text-xl text-start">{formatTime(timeRemaining)}</div>;
}
