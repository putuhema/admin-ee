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
import { EnrollmentData } from "@/features/enrollment/schema";
import { UseFormReturn } from "react-hook-form";

interface EntryDateFields {
  form: UseFormReturn<EnrollmentData>;
}

export default function EntryDateFields({ form }: EntryDateFields) {
  return (
    <FormField
      control={form.control}
      name="enrollmentDate"
      render={({ field }) => (
        <FormItem>
          <div className="flex flex-col gap-2">
            <FormLabel>
              Tanggal Masuk
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
                        !field.value && "text-muted-foreground",
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
