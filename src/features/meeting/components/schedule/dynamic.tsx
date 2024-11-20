"use client";

import CustomSheet from "@/components/custom-sheet";

import { Schedules } from "@/features/meeting/components/schedule/schedule";
import { ScheduleForm } from "@/features/meeting/components/schedule/schedule-form";

export default function DynamicSchedule() {
  return (
    <section>
      <CustomSheet SHEET_ID="MEETING_FORM" title="Schedule Meeting">
        <ScheduleForm />
      </CustomSheet>
      <div className="px-2 md:px-8">
        <Schedules />
      </div>
    </section>
  );
}
