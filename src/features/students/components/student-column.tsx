"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { type StudentType } from "../queries/use-get-students";
import StudentTableAction from "./student-table-action";

export const columns: ColumnDef<StudentType[number]>[] = [
  {
    accessorKey: "name",
    header: "Full Name",
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
    accessorKey: "address",
    header: "Address",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const studentId = row.original.id;
      return <StudentTableAction studentId={studentId} />;
    },
  },
];
