"use client";

import { useEffect, useState } from "react";
import { useIsClient } from "@uidotdev/usehooks";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { BookPrep } from "./types";
import { TableContainer } from "./components/table/table-container";

const COLUMN_CONFIGS = {
  all: [
    "select",
    "name",
    "status",
    "program",
    "notes",
    "prepareDate",
    "paidDate",
    "deliveredDate",
    "actions",
  ],
  sideView: ["select", "name", "status", "actions"],
} as const;

export default function BookPrepList(): JSX.Element | null {
  const [selectedItem, setSelectedItem] = useState<BookPrep | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    ...COLUMN_CONFIGS.all,
  ]);

  const isMobile = useIsMobile();
  const isClient = useIsClient();

  useEffect(() => {
    setVisibleColumns(
      selectedItem ? [...COLUMN_CONFIGS.sideView] : [...COLUMN_CONFIGS.all]
    );
  }, [selectedItem]);

  if (!isClient) return null;

  return (
    <main
      role="main"
      aria-label="Student management interface"
      className="flex h-full w-full flex-col gap-4 px-4 py-2 md:flex-row"
    >
      <section
        className={cn("h-full w-full", selectedItem && "md:w-1/2")}
        role="region"
        aria-label="Task list"
      >
        {((isMobile && !selectedItem) || !isMobile) && (
          <TableContainer
            onSelectItem={setSelectedItem}
            selectedItem={selectedItem}
            visibleColumns={visibleColumns}
          />
        )}
      </section>
    </main>
  );
}
