"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CreditCard, Delete, LetterText, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type EnrollementType } from "../hooks/use-get-enrollment";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";

export const columns: ColumnDef<EnrollementType[number]>[] = [
  {
    header: "Student Name",
    cell: ({ row }) => {
      return <span>{row.original.student?.name}</span>;
    },
  },
  {
    header: "Packages (Qty)",
    cell: ({ row }) => {
      const packages = row.original.packages!;
      return (
        <p className="text-center">
          {packages.name} ({row.original.enrollment.qty})
        </p>
      );
    },
  },
  {
    id: "program",
    header: () => <div className="text-center">Header</div>,
    cell: ({ row }) => {
      const { name, level } = row.original.program!;
      return (
        <span className="capitalize">
          {name} - {level}
        </span>
      );
    },
  },
  {
    header: "Status",
    cell: ({ row }) => {
      return <span>{row.original.enrollment.status}</span>;
    },
  },
  {
    header: "Fee",
    cell: ({ row }) => {
      return <span>{formatCurrency(row.original.orders?.amount ?? 0)}</span>;
    },
  },
  {
    header: "Payment Status",
    cell: ({ row }) => {
      return <span className="uppercase">{row.original.orders?.status}</span>;
    },
  },

  {
    header: "Enrollment Date",
    cell: ({ row }) => {
      const enrollmentDate = row.original.enrollment.enrollmentDate;
      return <span>{format(new Date(enrollmentDate!), "PPP")}</span>;
    },
  },
  {
    id: "actions",
    cell: () => {
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
            <DropdownMenuItem>
              <LetterText /> Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard /> Payment
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Delete />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
