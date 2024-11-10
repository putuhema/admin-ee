"use client";

import { ColumnDef } from "@tanstack/react-table";
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
import { type SubjectPricingType } from "../hooks/use-get-pricing";
import { formatCurrency } from "@/lib/utils";

export const columns: ColumnDef<SubjectPricingType[number]>[] = [
  {
    id: "subjectName",
    header: "Subject Name",
    cell: ({ row }) => <p className="capitalize">{row.original.subjectName}</p>,
  },
  {
    header: "Monthly Tuition",
    cell: ({ row }) => {
      return <span>{formatCurrency(row.original.fee.monthly!)}</span>;
    },
  },
  {
    header: "Book Fee",
    cell: ({ row }) => {
      return <span>{formatCurrency(row.original.fee.book!)}</span>;
    },
  },
  {
    header: "Certificate Fee",
    cell: ({ row }) => {
      return <span>{formatCurrency(row.original.fee.certificate!)}</span>;
    },
  },
  {
    header: "Medal Fee",
    cell: ({ row }) => {
      return <span>{formatCurrency(row.original.fee.medal!)}</span>;
    },
  },
  {
    header: "Trophy Fee",
    cell: ({ row }) => {
      return <span>{formatCurrency(row.original.fee.trophy!)}</span>;
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
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
