"use client";

import { ColumnDef } from "@tanstack/react-table";
import { type ResponseType } from "../hooks/get";
import DropdownAction from "../components/dropdown-action";
import { cn, formatCurrency } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export const columns: ColumnDef<ResponseType[number]>[] = [
  {
    header: "#",
    cell: ({ row }) => {
      return <span>{row.index + 1}</span>;
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <span className="capitalize">{row.getValue("name")}</span>;
    },
  },
  {
    accessorKey: "pricePerMeeting",
    header: () => <div className="text-center">Price Per Meeting</div>,
    cell: ({ row }) => {
      const price = row.getValue("pricePerMeeting") as number;

      return (
        <p className={cn("text-center")}>
          {price > 0 ? formatCurrency(Number(price)) : "-"}
        </p>
      );
    },
  },
  {
    accessorKey: "description",
    header: () => <div className="text-center">Description</div>,
    cell: ({ row }) => {
      return (
        <p className="truncate max-w-[200] lg:text-wrap md:max-w-[400px] mx-auto">
          {row.getValue("description")}
        </p>
      );
    },
  },
  {
    id: "extra",
    header: () => <div className="text-center">Program Extra Fee</div>,
    cell: ({ row }) => {
      const extras = row.original.extra;
      return (
        <div>
          {extras.map((extra: { type: string; price: number }) => (
            <div key={extra.type}>
              <div className="flex justify-between items-center text-muted-foreground hover:text-foreground cursor-pointer">
                <span className="capitalize">{extra.type}</span>
                <span>{formatCurrency(extra.price)}</span>
              </div>
              <Separator />
            </div>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const programId = row.original.id!;
      return <DropdownAction programId={programId} />;
    },
  },
];
