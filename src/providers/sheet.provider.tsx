"use client";

import * as React from "react";
import { useIsClient } from "@uidotdev/usehooks";

import { UpdateStudentSheet } from "@/features/students/components/update-student/update-student-sheet";
import { NewStudentSheet } from "@/features/students/components/add-student/new-student-sheet";
import { NewEnrollmentSheet } from "@/features/enrollment/components/add-enrollement/new-enrollment-sheet";
import { DetailsEnrollmentSheet } from "@/features/enrollment/components/details-enrollment/details-enrollment-sheet";
import { NewBookPreparationsSheet } from "@/features/book-preparations/components/create-book-preparations-sheet";
import { UpdateBookPreparationsSheet } from "@/features/book-preparations/components/update-book-preparation";

export default function SheetProvider() {
  const isClient = useIsClient();

  if (!isClient) {
    return null;
  }

  return (
    <div role="region" aria-label="Admin EE Dashboard">
      <NewStudentSheet />
      <UpdateStudentSheet />
      <NewEnrollmentSheet />
      <DetailsEnrollmentSheet />
      <NewBookPreparationsSheet />
      <UpdateBookPreparationsSheet />
    </div>
  );
}
