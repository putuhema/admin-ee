import * as React from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useEditStudent } from "@/features/students/hooks/use-edit-student";
import { useGetStudent } from "@/features/students/queries/use-get-student";
import { StudentForm } from "@/features/students/components/student-form/student-form";
import StudentFormSkeleton from "../student-form-skeleton";

export function UpdateStudentSheet() {
  const { isOpen, onClose, studentId } = useEditStudent();

  const { data: student, isLoading } = useGetStudent(studentId);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Update Student</SheetTitle>
          <SheetDescription>
            Fill out the form below to update the student information.
          </SheetDescription>
          <div role="region" aria-label="Student update form">
            {isLoading ? (
              <StudentFormSkeleton />
            ) : (
              <StudentForm student={student} aria-label="Update student" />
            )}
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
