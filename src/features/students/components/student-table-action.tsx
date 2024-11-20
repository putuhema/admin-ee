"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import { Delete, Eye, MoreHorizontal, PenLine } from "lucide-react";

import useEditStudent from "@/features/students/hooks/use-edit-student";
import { useGetStudentPrefetch } from "@/features/students/queries/use-get-student";
import { useDeleteStudent } from "@/features/students/queries/delete-student";
import { useConfirm } from "@/hooks/use-confirm";

type Props = {
  studentId: number;
};

export default function StudentTableAction({ studentId }: Props) {
  const { onOpen } = useEditStudent();
  const prefetch = useGetStudentPrefetch(studentId);
  const [ConfirmDeleteDialog, confirm] = useConfirm({
    title: "Delete Student",
    message: "Are you sure you want to delete this student?",
  });
  const { mutate: deleteStudent } = useDeleteStudent();

  const handleDelete = async () => {
    const confirmed = await confirm();
    if (confirmed) {
      deleteStudent({ id: studentId });
    }
  };

  const handleEdit = () => {
    onOpen(studentId);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link
            href={`/dashboard/student/${studentId}`}
            onMouseEnter={prefetch}
            onFocus={prefetch}
          >
            <DropdownMenuItem>
              <Eye /> View
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem onClick={handleEdit}>
            <PenLine />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete}>
            <Delete />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDeleteDialog />
    </>
  );
}
