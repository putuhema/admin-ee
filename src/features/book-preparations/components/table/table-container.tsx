/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { FilterIcon, PlusIcon, TrashIcon, TriangleAlert } from "lucide-react";
import ColumnSelection from "@/components/column-selection";
import { cn } from "@/lib/utils";
import { useConfirm } from "@/hooks/use-confirm";
import { BookPrep } from "../../types";
import { TableInstance } from "./table-wrapper";
import { Table } from "./table";
import { TableSearch } from "./table-search";
import TablePagination from "./table-pagination";
import { useBulkDeleteStudents } from "@/features/students/queries/bulk-delete";
import usenewBookPreparations from "@/features/book-preparations/hooks/use-new-preparations";

interface TableContainerProps {
  onSelectItem: (item: BookPrep) => void;
  selectedItem: BookPrep | null;
  visibleColumns: string[];
}

export const TableContainer = ({
  onSelectItem,
  selectedItem,
  visibleColumns,
}: TableContainerProps) => {
  const { onOpen } = usenewBookPreparations();
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const { mutate: deleteStudents } = useBulkDeleteStudents();
  const [ConfirmationDialog, confirm] = useConfirm({
    title: "Are you sure?",
    message: "The selected book preparations will get deleted permanently.",
  });

  return (
    <div
      className="py-2"
      role="region"
      aria-label="Book Preparations management interface"
    >
      <TableInstance visibleColumns={visibleColumns}>
        {(table, totalCount, isLoading, error) => {
          const selectedItems = table
            .getRowModel()
            .rows.filter((row) => row.getIsSelected());

          return (
            <>
              <TableToolbar
                onOpen={onOpen}
                selectedItem={selectedItem}
                selectedItems={selectedItems}
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
                onDeleteItems={createDeleteTasksHandler(
                  table,
                  selectedItems,
                  confirm,
                  deleteStudents
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
                  onSelectAction={onSelectItem}
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
  selectedItem: BookPrep | null;
  selectedItems: any[];
  isFilterOpen: boolean;
  setIsFilterOpen: (value: boolean) => void;
  onDeleteItems: () => Promise<void>;
  table: any;
}

const TableToolbar: React.FC<TableToolbarProps> = ({
  onOpen,
  selectedItem,
  selectedItems,
  isFilterOpen,
  setIsFilterOpen,
  onDeleteItems,
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
            <span className="hidden md:block">Prep Book</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Prepare new book</TooltipContent>
      </Tooltip>
      <TableSearch />
    </div>
    <div className="flex w-full items-center justify-end gap-2">
      <div>
        <DeleteButton selectedItems={selectedItems} onDelete={onDeleteItems} />
      </div>
      <div>
        <Tooltip>
          <TooltipTrigger asChild>
            <FilterButton
              isFilterOpen={isFilterOpen}
              setIsFilterOpen={setIsFilterOpen}
              selectedItem={selectedItem}
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
  onSelectAction: (items: BookPrep) => void;
}> = ({ table, totalCount, isLoading, onSelectAction }) => (
  <>
    <Table
      table={table}
      isLoading={isLoading}
      onSelectAction={onSelectAction}
    />
    <TablePagination table={table} totalResults={totalCount} />
  </>
);

const DeleteButton: React.FC<{
  selectedItems: any[];
  onDelete: () => Promise<void>;
}> = ({ selectedItems, onDelete }) =>
  selectedItems.length > 0 ? (
    <Button
      variant="destructive"
      className="flex items-center gap-2"
      onClick={onDelete}
      aria-label={`Delete ${selectedItems.length} selected students`}
    >
      <TrashIcon className="h-4 w-4" aria-hidden="true" />
      <span className="hidden md:block">
        {`Delete (${selectedItems.length})`}
      </span>
    </Button>
  ) : null;

const FilterButton: React.FC<{
  isFilterOpen: boolean;
  setIsFilterOpen: (value: boolean) => void;
  selectedItem: BookPrep | null;
}> = ({ isFilterOpen, setIsFilterOpen, selectedItem }) => (
  <Button
    variant="outline"
    className={cn(
      "flex items-center gap-2 lg:hidden",
      selectedItem ? "lg:flex" : ""
    )}
    onClick={() => setIsFilterOpen(!isFilterOpen)}
    aria-label="Toggle filter panel"
    aria-expanded={isFilterOpen}
  >
    <FilterIcon className="size-4" aria-hidden="true" />
    <span className="hidden md:block">Filter</span>
  </Button>
);

const ErrorMessage: React.FC = () => (
  <div
    className="mt-4 flex items-center justify-center gap-2 text-center text-sm text-red-500"
    role="alert"
  >
    <TriangleAlert className="size-4" aria-hidden="true" />
    <p className="font-medium">Error while fetching tasks</p>
  </div>
);

// const ExportButton: React.FC<{ selectedStudent: BookPrep | null }> = ({
//   selectedStudent,
// }) =>
//   !selectedStudent ? (
//     <Button
//       variant="outline"
//       className="flex items-center gap-2"
//       aria-label="Export students"
//     >
//       <DownloadIcon className="h-4 w-4" aria-hidden="true" />
//       <span className="hidden md:block">Export</span>
//     </Button>
//   ) : null;

// const ErrorMessage: React.FC = () => (
//   <div
//     className="mt-4 flex items-center justify-center gap-2 text-center text-sm text-red-500"
//     role="alert"
//   >
//     <TriangleAlert className="size-4" aria-hidden="true" />
//     <p className="font-medium">Error while fetching students</p>
//   </div>
// );

const createDeleteTasksHandler =
  (
    table: any,
    selectedStudents: any[],
    confirm: () => Promise<unknown>,
    deleteStudents: (ids: number[]) => void
  ) =>
  async () => {
    if (selectedStudents.length === 0) return;

    const confirmed = await confirm();
    if (confirmed) {
      table.setRowSelection({});
      deleteStudents(selectedStudents.map((row) => row.original.id));
    }
  };
