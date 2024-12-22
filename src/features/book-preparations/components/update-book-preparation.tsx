import * as React from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import BookPreparationsForm from "./form/book-preparations-form";
import useEditBookPreps from "../hooks/use-edit-dialog";
import { useGetBookPrep } from "../queries/get-book-preparation";

export function UpdateBookPreparationsSheet() {
  const { isOpen, onClose, id } = useEditBookPreps();

  const { data, isLoading } = useGetBookPrep(id);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="min-w-full md:min-w-[50%]">
        <SheetHeader>
          <VisuallyHidden.Root>
            <SheetTitle>Edit Buku Persiapan</SheetTitle>
          </VisuallyHidden.Root>
          <div role="region" aria-label="Update Book Preparations form">
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <BookPreparationsForm
                bookPrep={data}
                aria-label="Book Preparations form"
              />
            )}
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
