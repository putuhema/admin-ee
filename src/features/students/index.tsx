"use client";

import { useEffect, useState } from "react";
import { useIsClient } from "@uidotdev/usehooks";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Student } from "./queries/use-get-students";
import { StudentTableContainer } from "./components/student-table-container";

const COLUMN_CONFIGS = {
  all: ["select", "name", "nickname", "dateOfBirth", "actions"],
  sideView: ["select", "name", "nickname", "actions"],
} as const;

export default function StudentList(): JSX.Element | null {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    ...COLUMN_CONFIGS.all,
  ]);

  const isMobile = useIsMobile();
  const isClient = useIsClient();

  useEffect(() => {
    setVisibleColumns(
      selectedStudent ? [...COLUMN_CONFIGS.sideView] : [...COLUMN_CONFIGS.all],
    );
  }, [selectedStudent]);

  if (!isClient) return null;

  return (
    <main
      role="main"
      aria-label="Student management interface"
      className="flex h-full w-full flex-col gap-4 px-4 py-2 md:flex-row"
    >
      <section
        className={cn("h-full w-full", selectedStudent && "md:w-1/2")}
        role="region"
        aria-label="Task list"
      >
        {((isMobile && !selectedStudent) || !isMobile) && (
          <StudentTableContainer
            onSelectStudent={setSelectedStudent}
            selectedStudent={selectedStudent}
            visibleColumns={visibleColumns}
          />
        )}
      </section>
    </main>
  );
}
