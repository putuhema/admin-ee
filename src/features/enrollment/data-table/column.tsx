"use client";

import { ColumnDef } from "@tanstack/react-table";
import { type EnrollementType } from "../queries/use-get-enrollment";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import EnrollmentTableActions from "@/features/enrollment/components/table-action";

export const columns: ColumnDef<EnrollementType[number]>[] = [
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
      return <span>{row.original.student?.name}</span>;
    },
  },
  {
    header: "Paket diambil (Qty)",
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
    header: () => <div className="text-center">Program</div>,
    cell: ({ row }) => {
      const { name } = row.original.program!;
      return <span className="capitalize">{name}</span>;
    },
  },
  {
    id: "enrollmentStatus",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Status" />;
    },
    cell: ({ row }) => {
      return <span>{row.original.enrollment.status}</span>;
    },
  },
  {
    header: "Biaya",
    cell: ({ row }) => {
      return <span>{formatCurrency(row.original.orders?.amount ?? 0)}</span>;
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
      return <span className="uppercase">{row.original.orders?.status}</span>;
    },
  },

  {
    id: "enrollmentDate",
    accessorKey: "enrollment.enrollmentDate",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Tanggal Masuk" />;
    },
    cell: ({ row }) => {
      const enrollmentDate = row.original.enrollment.enrollmentDate;
      return <span>{format(new Date(enrollmentDate!), "PPP")}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <EnrollmentTableActions id={row.original.enrollment.id!} />;
    },
  },
];
