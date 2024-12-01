"use client";

import { Delete, Layers3, MoreHorizontal, PenLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSheetStore } from "@/lib/store";
import FormSheet, { SHEET_ID } from "./form-sheet";
import ProgramExtraSheet, {
  SHEET_ID as PROGRAM_EXTRA_FEE_SHEET_ID,
} from "./program-extra-sheet";

export default function DropdownAction({ programId }: { programId: number }) {
  const { toggleSheet } = useSheetStore();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            toggleSheet(PROGRAM_EXTRA_FEE_SHEET_ID + programId, true);
          }}
        >
          <Layers3 />
          Tambahan
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            toggleSheet(SHEET_ID + programId, true);
          }}
        >
          <PenLine />
          Ubah
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-500 focus:text-red-600">
          <Delete />
          Hapus
        </DropdownMenuItem>
      </DropdownMenuContent>
      <FormSheet id={programId} />
      <ProgramExtraSheet id={programId} />
    </DropdownMenu>
  );
}
