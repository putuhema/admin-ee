"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export type Student = {
  id: number;
  name: string | null;
  nickname: string | null;
  dateOfBirth: string | null;
  joinDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "nickname",
    header: "Nickname",
  },
  {
    accessorKey: "dateOfBirth",
    header: "Date of Birth",
    cell: ({ row }) => {
      const formmatedDAte = format(
        new Date(row.getValue("dateOfBirth")),
        "PPP",
      );

      return <span>{formmatedDAte}</span>;
    },
  },
  {
    accessorKey: "joinDate",
    header: "Join Date",
    cell: ({ row }) => {
      const formmatedDAte = format(new Date(row.getValue("joinDate")), "PPP");

      return <span>{formmatedDAte}</span>;
    },
  },
];
