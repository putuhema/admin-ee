import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { Hash, Loader2 } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import type { Student } from "../types";
import StudentTableAction from "./student-table-action";

export const studentColumns: ColumnDef<Student>[] = [
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
    header: "Name",
    accessorKey: "name",
    cell: (rowData) => renderTitleCell(rowData.row.original),
    minSize: 250,
  },

  {
    header: "Nickname",
    accessorKey: "nickname",
    cell: ({ row }) => (
      <div className="min-w-[100px]" role="cell">
        {row.original.nickname}
      </div>
    ),
    minSize: 100,
  },
  {
    header: "Address",
    accessorKey: "address",
    cell: ({ row }) => (
      <div className="min-w-[100px]" role="cell">
        {row.original.address}
      </div>
    ),
    minSize: 100,
  },
  {
    header: "Date of Birth",
    accessorKey: "dateOfBirth",
    cell: ({ row }) => renderDateCell(row.original.dateOfBirth),
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
        <StudentTableAction studentId={row.original.id} />
      </span>
    ),
    enableSorting: false,
    enableHiding: false,
    minSize: 40,
  },
];

const renderTitleCell = (student: Student) => (
  <div className="flex min-w-[250px] flex-col justify-center" role="cell">
    {renderTaskKey(student)}
    <span className="text-base font-semibold">{student.name}</span>
  </div>
);

const renderTaskKey = (student: Student) => {
  if (student.id) {
    return (
      <span className="flex items-center text-xs font-medium text-muted-foreground">
        <Hash className="size-3" aria-hidden="true" />
        {student.id}
      </span>
    );
  }
  if (student.optimisticStatus === "creating") {
    return (
      <span className="flex items-center text-xs">
        <Loader2
          className="size-3 animate-spin"
          aria-label="Creating task..."
        />
      </span>
    );
  }
  return "";
};

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

const renderDateCell = (date: Date | string | null, allowEmpty = false) => (
  <span className="min-w-[100px] text-sm font-medium" role="cell">
    {date ? format(new Date(date), "MMM d, yyyy") : allowEmpty ? "N/A" : ""}
  </span>
);

export default studentColumns;
