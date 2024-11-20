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
  name: keyof StudentFormData;
  label: string;
  placeholder: string;
  required?: boolean | undefined;
}

export function InputField({
  form,
  name,
  label,
  placeholder,
  required = false,
}: InputFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor={name} className="text-sm font-medium">
            {label}
            {required && (
              <span className="text-destructive ml-1" aria-hidden="true">
                *
              </span>
            )}
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              id={name}
              name={name}
              placeholder={placeholder}
              className="w-full"
              aria-label={label}
              aria-invalid={!!form.formState.errors[name]}
              aria-describedby={`${name}-error`}
            />
          </FormControl>
          <FormMessage id={`${name}-error`} />
        </FormItem>
      )}
    />
  );
}
