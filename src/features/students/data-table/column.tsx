"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { type StudentType } from "../hooks/use-get-students";
import TableDropdownAction from "../components/table-dropdown-action";

export const columns: ColumnDef<StudentType[number]>[] = [
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
        "PPP"
      );

      return <span>{formmatedDAte}</span>;
    },
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const studentId = row.original.id;
      return <TableDropdownAction studentId={studentId} />;
    },
  },
];
