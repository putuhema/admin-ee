import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import useOpenInvoiceDetailDrawer from "../hooks/use-open-details";

interface InvoiceActionProps {
  id: number;
}

export default function InvoiceAction({ id }: InvoiceActionProps) {
  const { onOpen } = useOpenInvoiceDetailDrawer();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis className="w-4 h-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onOpen(id)}>Details</DropdownMenuItem>
        <DropdownMenuItem>Modify</DropdownMenuItem>
        <DropdownMenuItem>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
