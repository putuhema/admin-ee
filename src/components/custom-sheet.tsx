import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useSheetStore } from "@/lib/store";

type Props = {
  SHEET_ID: string;
  title: string;
  desc: string;
  children: React.ReactNode;
};

export default function CustomSheet({
  SHEET_ID,
  title,
  desc,
  children,
}: Props) {
  const { getSheet, toggleSheet } = useSheetStore();
  return (
    <Sheet
      open={getSheet(SHEET_ID)?.isOpen}
      onOpenChange={(open) => {
        toggleSheet(SHEET_ID, open);
      }}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{desc}</SheetDescription>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}
