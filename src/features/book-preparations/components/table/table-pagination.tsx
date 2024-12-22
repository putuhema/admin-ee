/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const PAGE_SIZE_OPTIONS = [15, 25, 50, 100] as const;

interface TablePaginationProps {
  table: Table<any>;
  totalResults: number;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  table,
  totalResults,
}) => {
  const { pageIndex, pageSize } = table.getState().pagination;
  const start = pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, totalResults);

  return (
    <nav
      className="flex flex-col items-start justify-between gap-2 px-2 pt-4 md:flex-row md:items-center"
      aria-label="Table navigation"
    >
      <div
        className="flex-1 text-sm text-stone-700"
        role="status"
        aria-live="polite"
      >
        Showing {start} to {end} of {totalResults} results
      </div>

      <div className="flex items-center space-x-2">
        <PageSizeSelector
          pageSize={pageSize}
          onPageSizeChange={(value) => table.setPageSize(Number(value))}
        />

        <NavigationButtons table={table} />
      </div>
    </nav>
  );
};

const PageSizeSelector: React.FC<{
  pageSize: number;
  onPageSizeChange: (value: string) => void;
}> = ({ pageSize, onPageSizeChange }) => (
  <Select
    value={String(pageSize)}
    onValueChange={onPageSizeChange}
    aria-label="Select number of items per page"
  >
    <SelectTrigger className="h-9 w-32">
      <span>Show {pageSize}</span>
    </SelectTrigger>
    <SelectContent>
      {PAGE_SIZE_OPTIONS.map((size) => (
        <SelectItem key={size} value={String(size)}>
          Show {size}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

const NavigationButtons: React.FC<{
  table: Table<any>;
}> = ({ table }) => {
  const navigationButtons = [
    {
      label: "First",
      icon: ChevronsLeft,
      onClick: () => table.setPageIndex(0),
      disabled: !table.getCanPreviousPage(),
      ariaLabel: "Go to first page",
    },
    {
      label: "Previous",
      icon: ChevronLeft,
      onClick: () => table.previousPage(),
      disabled: !table.getCanPreviousPage(),
      ariaLabel: "Go to previous page",
    },
    {
      label: "Next",
      icon: ChevronRight,
      onClick: () => table.nextPage(),
      disabled: !table.getCanNextPage(),
      ariaLabel: "Go to next page",
    },
    {
      label: "Last",
      icon: ChevronsRight,
      onClick: () => table.setPageIndex(table.getPageCount() - 1),
      disabled: !table.getCanNextPage(),
      ariaLabel: "Go to last page",
    },
  ];

  return (
    <>
      {navigationButtons.map(
        ({ label, icon: Icon, onClick, disabled, ariaLabel }) => (
          <Button
            key={label}
            variant="outline"
            size="sm"
            onClick={onClick}
            disabled={disabled}
            className="flex items-center gap-2"
            aria-label={ariaLabel}
          >
            <Icon className="size-4" aria-hidden="true" />
            <span className="hidden md:block">{label}</span>
          </Button>
        )
      )}
    </>
  );
};

export default TablePagination;
