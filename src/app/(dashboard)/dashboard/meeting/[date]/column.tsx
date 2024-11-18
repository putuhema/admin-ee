"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import DropdownAction from "@/features/meeting/components/dropdown-action";
import { MeetingDateResponse } from "@/features/meeting/api/get-meeting-by-date";
import { format } from "date-fns";
import { Check, CircleCheck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import SessionButton from "./_components/session-button";

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
        <div className="flex flex-col">
          {programs.map((p) => (
            <SessionButton
              key={p.programId}
              meetings={p.meetings}
              sessionNumber={p.meetings.length}
            />
          ))}
        </div>
      );
    },
  },
  {
    id: "attendance",
    header: () => <div className="text-center">Attendance</div>,
    cell: ({ row }) => {
      const programs = row.original.programs;
      return (
        <div className="flex flex-col">
          {programs.map((p) => (
            <div key={p.programId} className="flex flex-col items-center">
              {p.meetings.map((m) => (
                <div key={m.id}>
                  {m.attendance ? (
                    <CircleCheck className="text-green-400" />
                  ) : (
                    <XCircle className="text-red-400" />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    },
  },
  {
    id: "teacher",
    header: "Tutor By",
    cell: ({ row }) => {
      const programs = row.original.programs;
      return (
        <div className="flex flex-col">
          {programs.map((p) => (
            <div key={p.programId}>
              {p.meetings.map((m) => (
                <div key={m.id}>{m.tutorName ? `Mr. ${m.tutorName}` : "-"}</div>
              ))}
            </div>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: () => {
      return <DropdownAction />;
    },
  },
];
