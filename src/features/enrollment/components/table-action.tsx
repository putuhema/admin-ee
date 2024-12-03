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

interface EnrollmentTableActionsProps {
  id: number;
}

export default function EnrollmentTableActions({
  id,
}: EnrollmentTableActionsProps) {
  const { onOpen } = useDetailsEnrollment();

  const handleOpenDeatils = () => {
    onOpen(id);
  };

  return (
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
        <DropdownMenuItem>
          <Delete />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
