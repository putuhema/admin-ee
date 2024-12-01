import React from "react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MultiSelectCombobox } from "@/components/multi-combobox";
import { UseFormReturn } from "react-hook-form";
import { EnrollmentData } from "@/features/enrollment/schema";
import { useGetProgramExtra } from "@/features/programs/hooks/get";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircleWarning } from "lucide-react";

interface MultiSelectExtrasProps {
  form: UseFormReturn<EnrollmentData>;
  programId: string;
}

export default function MultiSelectExtras({
  form,
  programId,
}: MultiSelectExtrasProps) {
  const { data: programExtra, isLoading } = useGetProgramExtra(
    Number(programId),
    true,
  );

  const extras = React.useMemo(() => {
    return (
      programExtra &&
      programExtra.map((extra) => ({
        label: extra.type,
        value: extra.id.toString(),
      }))
    );
  }, [programExtra]);

  const handleRenderSelectedItem = (
    values: string[],
    options: { label: string; value: string }[],
    items: number = 3,
  ): string => {
    if (values.length === 0) return "";

    if (values.length <= items) {
      return options
        .reduce<string[]>((accumulator, option) => {
          if (values.includes(option.value)) {
            accumulator.push(option.label);
          }
          return accumulator;
        }, [])
        .join(", ");
    }

    return `${values.length} selected`;
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="w-8 h-4" />
        <Skeleton className="w-full h-10" />
      </div>
    );
  }

  if (!programExtra) {
    return (
      <div className="text-sm text-red-500 flex items-center gap-2">
        <MessageCircleWarning />
        <div>
          <p className="text-wrap">
            Belum ada program tambahan untuk program ini.
          </p>
          <p className="text-xs text-red-400">
            Hubungi admin untuk menambahkan program.
          </p>
        </div>
      </div>
    );
  }

  return (
    <FormField
      control={form.control}
      name="extras"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tambahan</FormLabel>
          <FormControl>
            <MultiSelectCombobox
              label="Tambahan"
              options={extras!}
              value={field.value}
              onChange={field.onChange}
              renderItem={(option) => (
                <div
                  role="option"
                  aria-selected={field.value.includes(option.value)}
                >
                  {option.label}
                </div>
              )}
              renderSelectedItem={() =>
                handleRenderSelectedItem(field.value, extras!, 4)
              }
              aria-label="Filter by program type"
              aria-required="false"
              aria-multiselectable="true"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
