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

import { UseFormReturn } from "react-hook-form";
import { StudentFormData } from "@/features/students/schema";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateFieldsProps {
  form: UseFormReturn<StudentFormData>;
  name: keyof StudentFormData;
  label: string;
}

export function DateFields({ form, name, label }: DateFieldsProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel htmlFor={name}>
            {label}
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
                    aria-label="Choose date"
                    aria-expanded="false"
                    aria-haspopup="dialog"
                  >
                    {field.value ? (
                      <span aria-live="polite">
                        {format(field.value, "PPP")}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Pick a date</span>
                    )}
                    <CalendarIcon
                      className="ml-auto h-4 w-4 opacity-50"
                      aria-hidden="true"
                    />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                role="dialog"
                aria-label="Calendar date picker"
                className="w-auto p-0"
              >
                <Calendar
                  initialFocus
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={field.onChange}
                />
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
