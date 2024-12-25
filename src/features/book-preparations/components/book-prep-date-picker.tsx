"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUpdateBookPrepDate } from "../queries/patch-bookprep-date";

interface BookPrepDatePickerProps {
  id: number;
  type: "prepare" | "paid" | "delivered";
  date: Date | undefined;
}

export function BookPrepDatePicker({
  date,
  type,
  id,
}: BookPrepDatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [currentDate, setDate] = React.useState<Date | undefined>(date);

  const { mutate } = useUpdateBookPrepDate();

  const handleChangeDate = (d: Date | undefined) => {
    if (!d) return;
    setDate(d);
    mutate({
      id,
      date: new Date(d),
      type,
    });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full pl-3 text-left font-normal",
            !currentDate && "text-muted-foreground"
          )}
        >
          {currentDate ? (
            format(currentDate, "dd/MM/yyy")
          ) : (
            <span>Pick a date</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="single"
          selected={currentDate}
          onSelect={handleChangeDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
