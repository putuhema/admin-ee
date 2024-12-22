/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { BookPrep } from "@/features/book-preparations/types";
import { format } from "date-fns";
import TableAction from "./table-action";
import StatusColumnHeader from "./status-column-header";

export const bookPrepColumns: ColumnDef<BookPrep>[] = [
  {
    id: "select",
    accessorKey: "select",
    header: ({ table }) => (
      <div className="flex min-w-[10px] items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all students"
          name="select-all"
        />
      </div>
    ),
    cell: ({ row }) => renderSelectionCell(row),
    enableSorting: false,
    enableHiding: false,
    minSize: 10,
  },

  {
    header: "Nama Siswa",
    accessorKey: "name",
    cell: (rowData) => renderTitleCell(rowData.row.original),
    minSize: 250,
  },
  {
    header: "Program",
    accessorKey: "program",
    cell: ({ row }) => (
      <div className="min-w-[100px] capitalize" role="cell">
        {row.original.program?.name}
      </div>
    ),
    minSize: 100,
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="flex justify-center items-center min-w-[100px]">
        Status
      </div>
    ),
    cell: ({ row }) => (
      <div className="min-w-[100px]" role="cell">
        <StatusColumnHeader
          id={row.original.id}
          currentStatus={row.original.status}
        />
      </div>
    ),
    minSize: 100,
  },
  {
    header: "Tanggal Disiapkan",
    accessorKey: "prepareDate",
    cell: ({ row }) => (
      <div className="min-w-[100px]" role="cell">
        {row.original.prepareDate &&
          format(new Date(row.original.prepareDate), "dd/MM/yyy")}
      </div>
    ),
    minSize: 100,
  },
  {
    header: "Tanggal Bayar",
    accessorKey: "paidDate",
    cell: ({ row }) => (
      <div className="min-w-[100px]" role="cell">
        {row.original.paidDate &&
          format(new Date(row.original.paidDate), "dd/MM/yyy")}
      </div>
    ),
    minSize: 100,
  },
  {
    header: "Tanggal Diambil",
    accessorKey: "deliveredDate",
    cell: ({ row }) => (
      <div className="min-w-[100px]" role="cell">
        {row.original.deliveredDate &&
          format(new Date(row.original.deliveredDate), "dd/MM/yyy")}
      </div>
    ),
    minSize: 100,
  },
  {
    header: "",
    accessorKey: "actions",
    cell: ({ row }) => (
      <span
        className="flex min-w-[20px] items-center justify-center"
        role="cell"
      >
        <TableAction id={row.original.id} />
      </span>
    ),
    enableSorting: false,
    enableHiding: false,
    minSize: 40,
  },
];

const renderTitleCell = (prep: BookPrep) => (
  <div className="flex min-w-[200px] flex-col justify-center" role="cell">
    <span className="text-base font-semibold">{prep.student?.name}</span>
  </div>
);

const renderSelectionCell = (row: any) => {
  if (row.original.optimisticStatus === "creating") return null;

  return (
    <div className="flex items-center justify-center pr-4">
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={`Select task ${row.original.title}`}
        disabled={row.original.optimisticStatus === "deleting"}
        name={`select-${row.original.id}`}
      />
    </div>
  );
};

export default bookPrepColumns;
