"use client";

import React from "react";
import Schedule from "./home-schedule";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ScheduleTabs() {
  const [value, setValue] = React.useState("meetings");
  return (
    <Tabs
      value={value}
      onValueChange={setValue}
      defaultValue={value}
      className="max-w-xl mx-auto"
    >
      <TabsList className="w-full">
        <TabsTrigger value="meetings">All Schedule</TabsTrigger>
        <TabsTrigger value="my-meetings">My Schedule</TabsTrigger>
      </TabsList>
      <TabsContent value="meetings">
        <Schedule type="all" />
      </TabsContent>
      <TabsContent value="my-meetings">
        <Schedule type="loggin-user" />
      </TabsContent>
    </Tabs>
  );
}
