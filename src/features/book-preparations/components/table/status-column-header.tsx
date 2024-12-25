import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { BookCheck, CircleDollarSign, Clock, Warehouse } from "lucide-react";
import { useUpdateBookPrepStatus } from "../../queries/patch-status-bookprep";
import { BookPrepInsert } from "@/db/schema";

interface StatusColumnHeaderProps {
  id: number;
  currentStatus: string;
  className?: string;
  showIcon?: boolean;
}

const COLOR = {
  pending:
    "border-yellow-500 bg-yellow-50 text-yellow-600 focus:ring-yellow-600/50",
  prepared: "border-blue-500 bg-blue-50 text-blue-500 focus:ring-blue-600/50",
  paid: "border-lime-500 bg-lime-50 text-lime-500 focus:ring-lime-600/50",
  delivered:
    "border-green-500 bg-green-50 text-green-500 focus:ring-green-600/50",
} as const;

export default function StatusColumnHeader({
  id,
  currentStatus,
  className,
  showIcon = true,
}: StatusColumnHeaderProps) {
  const [status, setStatus] = React.useState(currentStatus);
  const { mutate } = useUpdateBookPrepStatus();

  const handleStatusChange = (value: string) => {
    setStatus(value);
    mutate({
      id,
      status: value as BookPrepInsert["status"],
    });
  };

  return (
    <Select defaultValue={status} onValueChange={handleStatusChange}>
      <SelectTrigger
        className={cn(
          "w-[135px] rounded-full pl-2 uppercase text-xs h-7",
          COLOR[status as keyof typeof COLOR],
          className
        )}
      >
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">
          <div className="inline-flex items-center gap-2">
            {showIcon && <Clock className="w-4 h-4" />}
            pending
          </div>
        </SelectItem>
        <SelectItem value="prepared">
          <div className="inline-flex items-center gap-2">
            {showIcon && <Warehouse className="w-4 h-4" />}
            prepared
          </div>
        </SelectItem>
        <SelectItem value="paid">
          <div className="inline-flex items-center gap-2">
            {showIcon && <CircleDollarSign className="w-4 h-4" />}
            paid
          </div>
        </SelectItem>
        <SelectItem value="delivered">
          <div className="inline-flex items-center gap-2">
            {showIcon && <BookCheck className="w-4 h-4" />}
            delivered
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
