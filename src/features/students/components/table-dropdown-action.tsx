import { Delete, Eye, MoreHorizontal, PenLine } from "lucide-react";

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
import { useGetStudentPrefetch } from "@/features/students/hooks/use-get-student";

type Props = {
  studentId: number;
};

export default function TableDropdownAction({ studentId }: Props) {
  const prefetch = useGetStudentPrefetch(studentId.toString());
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
        <Link
          href={`/dashboard/student/${studentId}`}
          onMouseEnter={prefetch}
          onFocus={prefetch}
        >
          <DropdownMenuItem>
            <Eye /> View
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem>
          <PenLine />
          Modify
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Delete />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
