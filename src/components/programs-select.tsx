"use client";

import React from "react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useGetPrograms } from "@/features/programs/hooks/get";
import { UseFormReturn } from "react-hook-form";

interface ProgramSelectProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any, any, any>;
}

export default function ProgramSelect({ form }: ProgramSelectProps) {
  const { data: programs } = useGetPrograms();

  return (
    <FormField
      control={form.control}
      name="programId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Program</FormLabel>
          <Select
            onValueChange={(value) => field.onChange(Number(value))}
            defaultValue={field.value.toString()}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a programs" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {programs?.map((program) => (
                <SelectItem
                  key={program.id}
                  value={program.id.toString()}
                  className="capitalize"
                >
                  {program.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
