import * as React from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { StudentForm } from "@/features/students/components/student-form/student-form";
import useNewStudent from "../../hooks/use-new-student";
import { Popover } from "@/components/ui/popover";

export function NewStudentSheet() {
  const { isOpen, onClose } = useNewStudent();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New Student</SheetTitle>
          <SheetDescription>
            Fill out the form below to create new the student information.
          </SheetDescription>
          <div role="region" aria-label="Student update form">
            <StudentForm aria-label="Create student" />
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
