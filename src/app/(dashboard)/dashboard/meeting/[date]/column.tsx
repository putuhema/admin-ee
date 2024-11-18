"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import DropdownAction from "@/features/meeting/components/dropdown-action";
import { MeetingDateResponse } from "@/features/meeting/api/get-meeting-by-date";
import { format } from "date-fns";
import { Check } from "lucide-react";

export const columns: ColumnDef<MeetingDateResponse[0]>[] = [
  {
    header: "#",
    cell: ({ row }) => {
      return <span>{row.index + 1}</span>;
    },
  },
  {
    accessorKey: "studentName",
    header: () => <div className="text-center">Student</div>,
    cell: ({ row }) => {
      return (
        <Link
          href={`/dashboard/student/${row.original.studentId}`}
          className="capitalize"
        >
          {row.original.studentName}
        </Link>
      );
    },
  },
  {
    id: "programs",
    header: () => <div className="text-center">Programs</div>,
    cell: ({ row }) => {
      const programs = row.original.programs;
      return (
        <div>
          {programs.map((p) => (
            <div key={p.programId} className="capitalize">
              {p.programName}
            </div>
          ))}
        </div>
      );
    },
  },
  {
    id: "duration",
    header: () => <div className="text-center">Duration</div>,
    cell: ({ row }) => {
      const programs = row.original.programs;
      return (
        <div>
          {programs.map((p) => (
            <div key={p.programId}>{p.meetings.length} session</div>
          ))}
        </div>
      );
    },
  },
  {
    id: "attendance",
    header: "Attendance",
    cell: () => (
      <div>
        <Check />
      </div>
    ),
  },
  {
    id: "teacher",
    header: "Teacher",
    cell: () => <div>putu mahendra</div>,
  },
  {
    id: "actions",
    cell: () => {
      return <DropdownAction />;
    },
  },
];
