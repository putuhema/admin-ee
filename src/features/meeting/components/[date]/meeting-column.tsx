"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { DropdownAction } from "@/features/meeting/components/[date]/meeting-action";
import { MeetingDateResponse } from "@/features/meeting/queries/get-meeting-by-date";
import { format } from "date-fns";
import { UserRoundCheck, UserRoundX } from "lucide-react";
import { MeetingTeacherCell } from "./meeting-teacher-cell";

export const columns: ColumnDef<MeetingDateResponse[0]>[] = [
  {
    header: "#",
    cell: ({ row }) => {
      return <span>{row.index + 1}</span>;
    },
  },
  {
    id: "session",
    header: () => <div className="text-center">Session</div>,
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 items-center justify-center">
          <span>{format(new Date(row.original.startTime), "hh:mm")}</span>
          <span>-</span>
          <span>{format(new Date(row.original.endTime), "hh:mm a")}</span>
        </div>
      );
    },
  },
  {
    id: "programs",
    header: () => <div className="text-center">Programs</div>,
    cell: ({ row }) => {
      return <div>{row.original.programName}</div>;
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
    id: "attendance",
    header: () => <div className="text-center">Is Attend</div>,
    cell: ({ row }) => {
      const isAttend = row.original.attendance;
      return (
        <div className="flex flex-col items-center">
          {isAttend ? (
            <UserRoundCheck className="w-4 h-4 text-green-500" />
          ) : (
            <UserRoundX className="w-4 h-4 text-red-500" />
          )}
        </div>
      );
    },
  },
  {
    id: "teacher",
    header: "Tutor By",
    cell: ({ row }) => {
      return (
        <MeetingTeacherCell
          tutorName={row.original.tutorName ?? ""}
          tutorId={row.original.tutorId!}
        />
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const meetingId = row.original.id;
      const checkInTime = new Date(row.original.startTime);
      const checkOutTime = new Date(row.original.endTime);
      return (
        <DropdownAction
          teacherId={row.original.tutorId ?? ""}
          meetingId={meetingId}
          checkInTime={checkInTime}
          checkOutTime={checkOutTime}
        />
      );
    },
  },
];
