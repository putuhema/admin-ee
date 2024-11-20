import { MoreHorizontal, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MeetingDialog from "./meeting-dialog";
import { useMeetingDialogStore } from "@/features/meeting/store";

type Props = {
  meetingId: number;
  teacherId: string;
  checkInTime: Date;
  checkOutTime: Date;
};

export function DropdownAction({
  meetingId,
  teacherId,
  checkInTime,
  checkOutTime,
}: Props) {
  const { setOpen, setMeeting } = useMeetingDialogStore();

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
          <DropdownMenuItem asChild>
            <Button
              variant="ghost"
              onClick={() => {
                setOpen(true);
                setMeeting({
                  teacherId,
                  meetingId,
                  checkInTime,
                  checkOutTime,
                });
              }}
            >
              <User />
              Assign
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem>View</DropdownMenuItem>
          <DropdownMenuItem className="text-red-500 focus:text-red-600">
            Delete Program
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <MeetingDialog />
    </>
  );
}
