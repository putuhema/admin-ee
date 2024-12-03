"use client";

import { ColumnDef } from "@tanstack/react-table";
import { type EnrollementData } from "../queries/use-get-enrollment";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import EnrollmentTableActions from "@/features/enrollment/components/table-action";

export const columns: ColumnDef<EnrollementData[number]>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "name",
    accessorKey: "student.name",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Name Siswa" />;
    },
    cell: ({ row }) => {
      return <span>{row.original.studentName}</span>;
    },
  },
  {
    header: "Paket diambil (Qty)",
    cell: ({ row }) => {
      return (
        <p className="text-center">
          {row.original.pacakgeName} ({row.original.enrollmentQty})
        </p>
      );
    },
  },
  {
    id: "program",
    header: () => <div className="text-center">Program</div>,
    cell: ({ row }) => {
      return <span className="capitalize">{row.original.programName}</span>;
    },
  },
  {
    id: "enrollmentStatus",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Status" />;
    },
    cell: ({ row }) => {
      return <span>{row.original.enrollmentStatus}</span>;
    },
  },
  {
    header: "Biaya",
    cell: ({ row }) => {
      return <span>{formatCurrency(row.original.orderAmount ?? 0)}</span>;
    },
  },
  {
    id: "status",
    accessorKey: "orders.status",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title="Status Pembayaran" />
      );
    },
    cell: ({ row }) => {
      return <span className="uppercase">{row.original.orderStatus}</span>;
    },
  },

  {
    id: "enrollmentDate",
    accessorKey: "enrollment.enrollmentDate",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Tanggal Masuk" />;
    },
    cell: ({ row }) => {
      return (
        <span>{format(new Date(row.original.enrollmentDate!), "PPP")}</span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <EnrollmentTableActions id={row.original.enrollmentId!} />;
    },
  },
];
