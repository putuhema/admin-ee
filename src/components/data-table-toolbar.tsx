"use client";

import { Table } from "@tanstack/react-table";
import { CheckCheck, CircleX, ClockIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/data-table-view-options";

import { DataTableFacetedFilter } from "@/components/data-table-faceted-filter";
import { usePathname } from "next/navigation";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  name?: string | undefined;
}

export const statuses = [
  {
    value: "pending",
    label: "Pending",
    icon: ClockIcon,
  },
  {
    value: "completed",
    label: "Completed",
    icon: CheckCheck,
  },
  {
    value: "cancelled",
    label: "Cancelled",
    icon: CircleX,
  },
];

export function DataTableToolbar<TData>({
  table,
  name,
}: DataTableToolbarProps<TData>) {
  const pathname = usePathname();
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter name..."
          value={
            (table.getColumn(name ?? "name")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn(name ?? "name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {pathname === "/dashboard/enrollment" && table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Payment Status"
            options={statuses}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
