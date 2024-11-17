import * as React from "react";

import { id } from "date-fns/locale";
import { format } from "date-fns";
import html2canvas from "html2canvas";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import MeetingItem from "./meeting-item";
import { Download, LayoutGrid, Loader2, Rows } from "lucide-react";

import { useSheetStore } from "@/lib/store";
import { useGetSchedule } from "@/features/meeting/api/get-schedule";

export default function MeetingDisplay() {
  const { toggleSheet } = useSheetStore();
  const [mode, setMode] = React.useState<"row" | "grid">("row");
  const scheduleRef = React.useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const { data: meetings, isLoading: isMeetingsLoading } = useGetSchedule(
    new Date(),
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
    <div className="space-y-8">
      <div className="flex items-center justify-end gap-4">
        <Button variant="outline" onClick={handleDownload}>
          {isDownloading ? <Loader2 className="animate-spin" /> : <Download />}
        </Button>
        <Button
          variant="outline"
          onClick={() => setMode((prev) => (prev === "row" ? "grid" : "row"))}
        >
          {mode === "grid" ? <LayoutGrid /> : <Rows />}
        </Button>
        <Button onClick={() => toggleSheet("MEETING_FORM", true)}>
          Create Schedule
        </Button>
      </div>
      <div
        ref={scheduleRef}
        className="w-full lg:max-w-4xl lg:mx-auto relative space-y-8 p-8"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold">Tutoring Schedule</h1>
          <p>{format(new Date(), "EEEE, dd MMMM yyy", { locale: id })}</p>
        </div>
        <div
          className={cn(
            "space-y-2",
            mode === "grid" && "grid grid-cols-2 gap-4",
          )}
        >
          {meetings.map((meeting, index) => (
            <div
              key={index}
              className={cn(
                "rounded-lg p-2 py-4 relative ",
                index % 2 === 0 && "bg-blue-50 border-blue-100",
              )}
            >
              <p
                className={cn(
                  "capitalize text-lg font-bold",
                  index % 2 != 0 && "text-blue-500",
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
