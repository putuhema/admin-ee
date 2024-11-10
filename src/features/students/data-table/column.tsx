"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type StudentType } from "../hooks/use-get-students";

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
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Student</DropdownMenuItem>
            <DropdownMenuItem>Modify Student</DropdownMenuItem>
            <DropdownMenuItem>Delete Student</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
