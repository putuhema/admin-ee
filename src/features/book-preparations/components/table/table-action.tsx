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

import { useConfirm } from "@/hooks/use-confirm";
import useEditBookPreps from "@/features/book-preparations/hooks/use-edit-dialog";
import { useDeleteBookPreparation } from "@/features/book-preparations/queries/delete-bookprep";

type Props = {
  id: number;
};

export default function TableAction({ id }: Props) {
  const { onOpen } = useEditBookPreps();
  const [ConfirmDeleteDialog, confirm] = useConfirm({
    title: "Delete Student",
    message: "Are you sure you want to delete this student?",
  });
  const { mutate: deleteBookprep } = useDeleteBookPreparation();

  const handleDelete = async () => {
    const confirmed = await confirm();
    if (confirmed) {
      deleteBookprep({ id });
    }
  };

  const handleEdit = () => {
    onOpen(id);
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
          <Link href={`/dashboard/book-preparations/${id}`}>
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
