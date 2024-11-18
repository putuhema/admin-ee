"use client";

import { id } from "date-fns/locale";
import { format } from "date-fns";

import { ColumnDef } from "@tanstack/react-table";
import DropdownAction from "@/features/meeting/components/dropdown-action";
import { MeetingsResponse } from "../api/get-meetings";
import Link from "next/link";

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
    header: () => <div className="text-center">Attendance</div>,
    cell: () => {
      return <p className="text-center">0</p>;
    },
  },
  {
    id: "actions",
    cell: () => {
      return <DropdownAction />;
    },
  },
];
