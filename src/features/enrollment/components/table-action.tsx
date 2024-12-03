import React from "react";

import { CreditCard, Delete, LetterText, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useDetailsEnrollment from "../hooks/use-details-enrollment";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteEnrollment } from "../queries/delete-enrollment";

interface EnrollmentTableActionsProps {
  id: number;
}

export default function EnrollmentTableActions({
  id,
}: EnrollmentTableActionsProps) {
  const { onOpen } = useDetailsEnrollment();
  const [ConfirmationDialog, confirm] = useConfirm({
    title: "Delete Enrollment",
    message: "Are you sure you want to delete this enrollment?",
  });

  const handleOpenDeatils = () => {
    onOpen(id);
  };

  const { mutate } = useDeleteEnrollment();
  const handleDelete = async () => {
    const result = await confirm();

    if (result) {
      mutate({ id });
    }
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
          <DropdownMenuItem>
            <LetterText /> Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleOpenDeatils}>
            <CreditCard /> Payment
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete}>
            <Delete />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmationDialog />
    </>
  );
}
