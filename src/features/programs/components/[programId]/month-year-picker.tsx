import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const currentYear = new Date().getFullYear() + 1;
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

interface MonthYearPickerProps {
  handleMonthYearChange: (month: number, year: number) => void;
}

export default function MonthYearPicker({
  handleMonthYearChange,
}: MonthYearPickerProps) {
  const [month, setMonth] = React.useState(new Date().getMonth());
  const [year, setYear] = React.useState(new Date().getFullYear());

  const handleMonthChange = (value: string) => {
    setMonth(parseInt(value));
    handleMonthYearChange(parseInt(value), year);
  };

  const handleYearChange = (value: string) => {
    setYear(parseInt(value));
    handleMonthYearChange(month, parseInt(value));
  };

  return (
    <div className="flex justify-between items-center p-3 gap-2">
      <Select onValueChange={handleMonthChange} value={month.toString()}>
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
      <Select onValueChange={handleYearChange} value={year.toString()}>
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
  );
}
