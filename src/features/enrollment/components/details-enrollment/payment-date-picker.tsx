import React from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useEnrollmentPayment } from "@/features/enrollment/queries/put-enrollment-payment";

interface PaymendDatePickerProps {
  orderId: number;
  paymentDate?: Date | undefined;
}

export default function PaymentDatePicker({
  orderId,
  paymentDate,
}: PaymendDatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(paymentDate);
  const { mutate, isPending } = useEnrollmentPayment();

  const handleSelectDate = (date: Date | undefined) => {
    if (date) {
      mutate({ orderId, paymentDate: date });
    }
    setDate(date);
    setOpen(false);
  };

  return isPending ? (
    <Loader2 className="animate-spin w-6 h-6 mx-auto  text-muted-foreground" />
  ) : (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full pl-3 text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          {date ? format(date, "PPP") : <span>Pilih Tanggal Bayar</span>}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelectDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
