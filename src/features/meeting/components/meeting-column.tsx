"use client";

import Link from "next/link";

import { id } from "date-fns/locale";
import { format } from "date-fns";

import { ColumnDef } from "@tanstack/react-table";
import { MeetingsResponse } from "../queries/get-meetings";

export const columns: ColumnDef<MeetingsResponse[0]>[] = [
  {
    header: "#",
    cell: ({ row }) => {
      return <span>{row.index + 1}</span>;
    },
  },
  {
    accessorKey: "meetingDate",
    header: () => <div className="text-center">Meeting Date</div>,
    cell: ({ row }) => {
      const date: Date = row.getValue("meetingDate");
      return (
        <Link href={`/dashboard/meeting/${date}`} className="capitalize">
          {format(date, "EEEE, dd MMM yyy", {
            locale: id,
          })}
        </Link>
      );
    },
  },
  {
    accessorKey: "count",
    header: () => <div className="text-center">Scheduled</div>,
    cell: ({ row }) => {
      return <p className="text-center">{row.getValue("count")} meetings</p>;
    },
  },
  {
    id: "attendance",
    accessorKey: "attendance",
    header: () => <div className="text-start">Attendance</div>,
    cell: ({ row }) => {
      const attendance = row.getValue("attendance");
      const ratio = Math.floor(
        (Number(attendance) / Number(row.getValue("count"))) * 100,
      );
      return (
        <p className="text-start">
          {row.getValue("attendance")} present{" "}
          <span className="text-muted-foreground text-xs italic">{ratio}%</span>
        </p>
      );
    },
  },
];
