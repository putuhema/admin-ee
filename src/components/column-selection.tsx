"use client";

import React from "react";
import { Table } from "@tanstack/react-table";
import { ColumnsIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ColumnSelectionProps<T> {
  table: Table<T>;
}

export function ColumnSelection<T>({ table }: ColumnSelectionProps<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          aria-label="Toggle column visibility"
        >
          <ColumnsIcon className="h-4 w-4" aria-hidden="true" />
          <span className="hidden md:block">Columns</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="min-w-[150px]"
        aria-label="Column visibility options"
      >
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            const columnName =
              typeof column.columnDef.header === "string"
                ? column.columnDef.header
                : column.id;

            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                aria-label={`Toggle ${columnName} column visibility`}
              >
                {columnName}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ColumnSelection;
