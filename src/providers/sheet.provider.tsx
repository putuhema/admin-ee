"use client";

import * as React from "react";
import { useIsClient } from "@uidotdev/usehooks";

import { UpdateStudentSheet } from "@/features/students/components/update-student/update-student-sheet";
import { NewStudentSheet } from "@/features/students/components/add-student/new-student-task";

export default function SheetProvider() {
  const isClient = useIsClient();

  if (!isClient) {
    return null;
  }

  return (
    <div role="region" aria-label="Admin EE Dashboard">
      <NewStudentSheet />
      <UpdateStudentSheet />
    </div>
  );
}
