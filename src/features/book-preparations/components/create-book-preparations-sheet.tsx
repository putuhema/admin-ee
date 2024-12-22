import * as React from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import usenewBookPreparations from "@/features/book-preparations/hooks/use-new-preparations";
import BookPreparationsForm from "./form/book-preparations-form";

export function NewBookPreparationsSheet() {
  const { isOpen, onClose } = usenewBookPreparations();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="min-w-full md:min-w-[50%]">
        <SheetHeader>
          <VisuallyHidden.Root>
            <SheetTitle>Pendaftaran Baru</SheetTitle>
          </VisuallyHidden.Root>
          <div role="region" aria-label="New Book Preparations form">
            <BookPreparationsForm aria-label="Book Preparations form" />
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
