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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Calendar } from "@/components/ui/calendar";

import { UseFormReturn } from "react-hook-form";
import { StudentFormData } from "@/features/students/schema";
import { Button } from "@/components/ui/button";
import { format, setMonth, setYear } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateFieldsProps {
  form: UseFormReturn<StudentFormData>;
  name: keyof StudentFormData;
  label: string;
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

export function DateFields({ form, name, label }: DateFieldsProps) {
  const handleMonthChange = (value: string) => {
    const currentDate = new Date(form.getValues(name) as Date);
    form.setValue(name, setMonth(currentDate, parseInt(value)));
  };

  const handleYearChange = (value: string) => {
    const currentDate = new Date(form.getValues(name) as Date);
    form.setValue(name, setYear(currentDate, parseInt(value)));
  };

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
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground",
                  )}
                  aria-label="Choose date of birth"
                  aria-expanded="false"
                  aria-haspopup="dialog"
                >
                  {field.value ? (
                    <span aria-live="polite">{format(field.value, "PPP")}</span>
                  ) : (
                    <span className="text-muted-foreground">Pick a date</span>
                  )}
                  <CalendarIcon
                    className="ml-auto h-4 w-4 opacity-50"
                    aria-hidden="true"
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                role="dialog"
                aria-label="Calendar date picker"
                className="w-auto p-0"
              >
                <div className="flex justify-between items-center p-3 border-b">
                  <Select
                    onValueChange={handleMonthChange}
                    value={(field.value ? new Date(field.value) : new Date())
                      .getMonth()
                      .toString()}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {monthNames.map((month, index) => (
                        <SelectItem key={month} value={index.toString()}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    onValueChange={handleYearChange}
                    value={(field.value ? new Date(field.value) : new Date())
                      .getFullYear()
                      .toString()}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={field.onChange}
                  month={field.value ? new Date(field.value) : undefined}
                  onMonthChange={field.onChange}
                  initialFocus
                  disabled={(date) =>
                    date > new Date() || date < new Date(1900, 0, 1)
                  }
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
