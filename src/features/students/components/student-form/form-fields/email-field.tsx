import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { UseFormReturn } from "react-hook-form";
import { StudentFormData } from "@/features/students/schema";

interface InputFieldProps {
  form: UseFormReturn<StudentFormData>;
}

export function EmailField({ form }: InputFieldProps) {
  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor="email">Email</FormLabel>
          <FormControl>
            <Input
              {...field}
              id="email"
              name="emal"
              placeholder="Email"
              type="email"
              className="w-full"
              aria-label="Email"
              aria-invalid={!!form.formState.errors["email"]}
              aria-describedby={`email-error`}
            />
          </FormControl>
          <FormMessage id={`email-error`} />
        </FormItem>
      )}
    />
  );
}
