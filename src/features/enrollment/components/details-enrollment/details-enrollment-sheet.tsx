import * as React from "react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import useDetailsEnrollment from "../../hooks/use-details-enrollment";
import EnrollmentDetails from "./enrollment-details";

export function DetailsEnrollmentSheet() {
  const { isOpen, onClose } = useDetailsEnrollment();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <VisuallyHidden.Root>
          <DialogTitle>Reciept</DialogTitle>
        </VisuallyHidden.Root>
        <EnrollmentDetails />
      </DialogContent>
    </Dialog>
  );
}
