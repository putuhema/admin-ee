import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { UseFormReturn } from "react-hook-form";
import { StudentFormData } from "@/features/students/schema";
import { Textarea } from "@/components/ui/textarea";

interface InputFieldProps {
  form: UseFormReturn<StudentFormData>;
}

export function NoteField({ form }: InputFieldProps) {
  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor="notes">Notes</FormLabel>
          <FormControl>
            <Textarea
              {...field}
              id="notes"
              name="notes"
              placeholder="Notes"
              className="w-full"
              aria-label="Notes"
              aria-invalid={!!form.formState.errors["notes"]}
              aria-describedby={`notes-error`}
            />
          </FormControl>
          <FormMessage id={`notes-error`} />
        </FormItem>
      )}
    />
  );
}
