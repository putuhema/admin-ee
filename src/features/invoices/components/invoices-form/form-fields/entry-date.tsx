import React from "react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";

import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { InvoiceData } from "@/features/invoices/schema";
import { UseFormReturn } from "react-hook-form";

interface DateFieldsProps {
  form: UseFormReturn<InvoiceData>;
}

export default function DateFields({ form }: DateFieldsProps) {
  return (
    <FormField
      control={form.control}
      name="date"
      render={({ field }) => (
        <FormItem>
          <div className="flex flex-col gap-2">
            <FormLabel>
              Tanggal Batas Pembayaran
              <span className="text-destructive ml-1" aria-hidden="true">
                *
              </span>
            </FormLabel>
            <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
