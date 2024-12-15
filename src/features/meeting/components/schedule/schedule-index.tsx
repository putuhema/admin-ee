"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Schedule from "./home-schedule";
import TeacherSchedule from "./teacher-schedule";

export default function SchedulePage() {
  const [value, setValue] = React.useState("meetings");
  return (
    <Tabs
      value={value}
      onValueChange={setValue}
      defaultValue={value}
      className="max-w-xl mx-auto"
    >
      <TabsList className="w-full">
        <TabsTrigger value="meetings">Meetings</TabsTrigger>
        <TabsTrigger value="my-meetings">My Meetings</TabsTrigger>
      </TabsList>
      <TabsContent value="meetings">
        <Schedule />
      </TabsContent>
      <TabsContent value="my-meetings">
        <TeacherSchedule />
      </TabsContent>
    </Tabs>
  );
}
