import * as React from "react";
import type { Student } from "../types";
import { TableInstance } from "./student-table-wrapper";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  DownloadIcon,
  FilterIcon,
  PlusIcon,
  TrashIcon,
  TriangleAlert,
} from "lucide-react";
import { StudentSearch } from "./student-table-search";
import ColumnSelection from "@/components/column-selection";
import { StudentTable } from "./student-table";
import { cn } from "@/lib/utils";
import TablePagination from "./student-table-pagination";
import useNewStudent from "../hooks/use-new-student";
import { useBulkDeleteStudents } from "../queries/bulk-delete";
import { useConfirm } from "@/hooks/use-confirm";

interface StudentTableContainerProps {
  onSelectStudent: (student: Student) => void;
  selectedStudent: Student | null;
  visibleColumns: string[];
}

export const StudentTableContainer = ({
  onSelectStudent,
  selectedStudent,
  visibleColumns,
}: StudentTableContainerProps) => {
  const { onOpen } = useNewStudent();
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const { mutate: deleteStudents } = useBulkDeleteStudents();
  const [ConfirmationDialog, confirm] = useConfirm({
    title: "Are you sure?",
    message: "The selected students will get deleted permanently.",
  });

  return (
    <div
      className="py-2"
      role="region"
      aria-label="Student management interface"
    >
      <TableInstance visibleColumns={visibleColumns}>
        {(table, totalCount, isLoading, error) => {
          const selectedStudents = table
            .getRowModel()
            .rows.filter((row) => row.getIsSelected());

          return (
            <>
              <TableToolbar
                onOpen={onOpen}
                selectedStudent={selectedStudent}
                selectedStudents={selectedStudents}
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
                onDeleteStudents={createDeleteTasksHandler(
                  table,
                  selectedStudents,
                  confirm,
                  deleteStudents,
                )}
                table={table}
              />

              {error ? (
                <ErrorMessage />
              ) : (
                <TableContent
                  table={table}
                  totalCount={totalCount}
                  isLoading={isLoading}
                  onSelectStudent={onSelectStudent}
                />
              )}
            </>
          );
        }}
      </TableInstance>
      <ConfirmationDialog />
    </div>
  );
};

interface TableToolbarProps {
  onOpen: () => void;
  selectedStudent: Student | null;
  selectedStudents: any[];
  isFilterOpen: boolean;
  setIsFilterOpen: (value: boolean) => void;
  onDeleteStudents: () => Promise<void>;
  table: any;
}

const TableToolbar: React.FC<TableToolbarProps> = ({
  onOpen,
  selectedStudent,
  selectedStudents,
  isFilterOpen,
  setIsFilterOpen,
  onDeleteStudents,
  table,
}) => (
  <div className="mb-4 flex flex-col items-start justify-between gap-4 md:flex-row">
    <div className="flex w-full items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={onOpen}
            aria-label="Add new student"
          >
            <PlusIcon className="h-4 w-4" aria-hidden="true" />
            <span className="hidden md:block">Add Student</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Add new student</TooltipContent>
      </Tooltip>
      <StudentSearch />
    </div>
    <div className="flex w-full items-center justify-end gap-2">
      <div>
        <DeleteButton
          selectedStudents={selectedStudents}
          onDelete={onDeleteStudents}
        />
      </div>
      <div>
        <Tooltip>
          <TooltipTrigger asChild>
            <FilterButton
              isFilterOpen={isFilterOpen}
              setIsFilterOpen={setIsFilterOpen}
              selectedStudent={selectedStudent}
            />
          </TooltipTrigger>
          <TooltipContent>Filter tasks</TooltipContent>
        </Tooltip>
      </div>
      <div>
        <Tooltip>
          <TooltipTrigger asChild>
            <ColumnSelection table={table} />
          </TooltipTrigger>
          <TooltipContent>Show/hide columns</TooltipContent>
        </Tooltip>
      </div>
      <div>
        {/* <Tooltip> */}
        {/*   <TooltipTrigger asChild> */}
        {/*     <ExportButton selectedStudent={selectedStudent} /> */}
        {/*   </TooltipTrigger> */}
        {/* </Tooltip> */}
      </div>
    </div>
  </div>
);

const TableContent: React.FC<{
  table: any;
  totalCount: number;
  isLoading: boolean;
  onSelectStudent: (student: Student) => void;
}> = ({ table, totalCount, isLoading, onSelectStudent }) => (
  <>
    <StudentTable
      table={table}
      isLoading={isLoading}
      onSelectStudent={onSelectStudent}
    />
    <TablePagination table={table} totalResults={totalCount} />
  </>
);

const DeleteButton: React.FC<{
  selectedStudents: any[];
  onDelete: () => Promise<void>;
}> = ({ selectedStudents, onDelete }) =>
  selectedStudents.length > 0 ? (
    <Button
      variant="destructive"
      className="flex items-center gap-2"
      onClick={onDelete}
      aria-label={`Delete ${selectedStudents.length} selected students`}
    >
      <TrashIcon className="h-4 w-4" aria-hidden="true" />
      <span className="hidden md:block">
        {`Delete (${selectedStudents.length})`}
      </span>
    </Button>
  ) : null;

const FilterButton: React.FC<{
  isFilterOpen: boolean;
  setIsFilterOpen: (value: boolean) => void;
  selectedStudent: Student | null;
}> = ({ isFilterOpen, setIsFilterOpen, selectedStudent }) => (
  <Button
    variant="outline"
    className={cn(
      "flex items-center gap-2 lg:hidden",
      selectedStudent ? "lg:flex" : "",
    )}
    onClick={() => setIsFilterOpen(!isFilterOpen)}
    aria-label="Toggle filter panel"
    aria-expanded={isFilterOpen}
  >
    <FilterIcon className="size-4" aria-hidden="true" />
    <span className="hidden md:block">Filter</span>
  </Button>
);

const ExportButton: React.FC<{ selectedStudent: Student | null }> = ({
  selectedStudent,
}) =>
  !selectedStudent ? (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      aria-label="Export students"
    >
      <DownloadIcon className="h-4 w-4" aria-hidden="true" />
      <span className="hidden md:block">Export</span>
    </Button>
  ) : null;

const ErrorMessage: React.FC = () => (
  <div
    className="mt-4 flex items-center justify-center gap-2 text-center text-sm text-red-500"
    role="alert"
  >
    <TriangleAlert className="size-4" aria-hidden="true" />
    <p className="font-medium">Error while fetching students</p>
  </div>
);

const createDeleteTasksHandler =
  (
    table: any,
    selectedStudents: any[],
    confirm: () => Promise<unknown>,
    deleteStudents: (ids: number[]) => void,
  ) =>
  async () => {
    if (selectedStudents.length === 0) return;

    const confirmed = await confirm();
    if (confirmed) {
      table.setRowSelection({});
      deleteStudents(selectedStudents.map((row) => row.original.id));
    }
  };
