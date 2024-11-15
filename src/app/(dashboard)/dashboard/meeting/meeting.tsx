import * as React from "react";

import { useGetMeetings } from "@/features/meeting/api/get-meetings";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import html2canvas from "html2canvas";
import MeetingItem from "./meeting-item";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

export default function MeetingDisplay() {
  const scheduleRef = React.useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const { data: meetings, isLoading: isMeetingsLoading } = useGetMeetings(
    new Date()
  );

  const handleDownload = async () => {
    if (!scheduleRef.current) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(scheduleRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = "tutoring-schedule.png";
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
    }
    setIsDownloading(false);
  };

  if (isMeetingsLoading) return <div>Loading...</div>;
  if (!meetings) return <div>No meetings</div>;

  return (
    <div>
      <Button onClick={handleDownload}>
        {isDownloading ? (
          <Loader2 className="animate-spin mr-2" />
        ) : (
          <Download className="mr-2" />
        )}
        Download
      </Button>
      <div ref={scheduleRef} className="w-full relative space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Tutoring Schedule</h1>
          <p>{format(new Date(), "dd MMMM yyy")}</p>
        </div>
        <div className="space-y-2">
          {meetings.map((meeting, index) => (
            <div
              key={index}
              className={cn(
                "rounded-lg p-2 relative",
                index % 2 === 0 && "bg-blue-50 border-blue-100"
              )}
            >
              <p
                className={cn(
                  "capitalize text-lg font-bold",
                  index % 2 != 0 && "text-blue-500"
                )}
              >
                {meeting.programName}
              </p>
              <div className="pl-4 space-y-1">
                {meeting.meetings.map((m) => (
                  <MeetingItem
                    meetingId={m.id}
                    key={m.id}
                    m={m}
                    index={index}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
