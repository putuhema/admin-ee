import * as React from "react";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  PaginationState,
  type Table,
} from "@tanstack/react-table";

import { DEFAULT_PAGE_SIZE } from "@/constants";
import { useStudentFiltersStore } from "@/features/students/store";
import {
  Student,
  useGetStudents,
} from "@/features/students/queries/use-get-students";
import { studentColumns as columns } from "./student-column";

interface TableInstanceProps {
  children: (
    table: Table<Student>,
    totalCount: number,
    isLoading: boolean,
    error: Error | null,
  ) => React.ReactNode;
  visibleColumns: string[];
}

export const TableInstance = ({
  children,
  visibleColumns,
}: TableInstanceProps) => {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const { appliedFilters } = useStudentFiltersStore();

  const { data, isLoading, error } = useGetStudents(
    pagination.pageSize,
    pagination.pageIndex * pagination.pageSize,
    {
      ...appliedFilters,
      order:
        sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined,
      sort: sorting.length > 0 ? sorting[0].id : undefined,
    },
  );

  const totalCount = data?.pagination.total || 0;

  const students =
    data?.students.map((student) => ({
      ...student,
      dateOfBirth: new Date(student.dateOfBirth),
      createdAt: new Date(student.createdAt),
      updatedAt: new Date(student.updatedAt),
      isDeleted: false,
      deletedAt: null,
    })) || [];

  const table = useReactTable<Student>({
    data: students,
    columns: columns.filter(
      (column) =>
        "accessorKey" in column &&
        visibleColumns.includes(column.accessorKey as string),
    ),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      rowSelection,
      columnVisibility,
      sorting,
      pagination,
    },
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    enableRowSelection: true,
  });

  return (
    <div role="region" aria-label="Task table container">
      {children(table, totalCount, isLoading, error)}
    </div>
  );
};
