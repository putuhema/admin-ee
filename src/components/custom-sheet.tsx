"use client";
import * as React from "react";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import { useSheetStore } from "@/lib/store";

type Props = {
  SHEET_ID: string;
  title: string;
  children: React.ReactNode;
};

export default function CustomSheet({ SHEET_ID, title, children }: Props) {
  const { sheets, toggleSheet } = useSheetStore();
  return (
    <Sheet
      open={sheets[SHEET_ID]?.isOpen}
      onOpenChange={(open) => {
        toggleSheet(SHEET_ID, open);
      }}
    >
      <SheetContent className="min-w-[100%] lg:min-w-[30%]">
        <VisuallyHidden.Root>
          <SheetTitle>{title}</SheetTitle>
        </VisuallyHidden.Root>
        {children}
      </SheetContent>
    </Sheet>
  );
}
