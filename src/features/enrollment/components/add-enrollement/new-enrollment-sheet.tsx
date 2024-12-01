import * as React from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import useNewEnrollment from "@/features/enrollment/hooks/use-new-enrollment";
import EnrollmentForm from "@/features/enrollment/components/enrollment-form/enrollment-form";

export function NewEnrollmentSheet() {
  const { isOpen, onClose } = useNewEnrollment();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="min-w-full md:min-w-[50%]">
        <SheetHeader>
          <VisuallyHidden.Root>
            <SheetTitle>Pendaftaran Baru</SheetTitle>
          </VisuallyHidden.Root>
          <div role="region" aria-label="New Enrollment form">
            <EnrollmentForm aria-label="Create Enrollment" />
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
