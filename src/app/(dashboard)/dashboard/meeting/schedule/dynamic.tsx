"use client";

import * as React from "react";
import MeetingForm from "../form";
import MeetingDisplay from "../meeting";
import CustomSheet from "@/components/custom-sheet";

export default function DynamicSchedule() {
  return (
    <section>
      <CustomSheet
        SHEET_ID="MEETING_FORM"
        title="Schedule Meeting"
        desc="Schedule a meeting with a student"
      >
        <MeetingForm />
      </CustomSheet>
      <div className="px-2 md:px-8">
        <MeetingDisplay />
      </div>
    </section>
  );
}
