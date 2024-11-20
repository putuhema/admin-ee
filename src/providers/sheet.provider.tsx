"use client";

import React from "react";
import { useIsClient } from "@uidotdev/usehooks";

import StudentFormSheet from "@/features/students/components/student-form-sheet";
import { UpdateStudentSheet } from "@/features/students/components/update-student/update-student-sheet";

export default function SheetProvider() {
  const isClient = useIsClient();

  if (!isClient) {
    return null;
  }

  return (
    <div role="region" aria-label="Admin EE Dashboard">
      <StudentFormSheet />
      <UpdateStudentSheet />
    </div>
  );
}
