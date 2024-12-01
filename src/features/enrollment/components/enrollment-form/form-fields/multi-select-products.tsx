import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { EnrollmentData } from "@/features/enrollment/schema";
import { MultiSelectCombobox } from "@/components/multi-combobox";
import { useGetProducts } from "@/features/products/api/use-get-products";

interface MultiSelectProductsProps {
  form: UseFormReturn<EnrollmentData>;
}

export default function MultiSelectProducts({
  form,
}: MultiSelectProductsProps) {
  const { data: products } = useGetProducts();

  const productsMemo = React.useMemo(() => {
    return (
      products &&
      products.map((product) => ({
        label: product.name,
        value: product.id.toString(),
      }))
    );
  }, [products]);

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

  return (
    <FormField
      control={form.control}
      name="products"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Produk Lainnya</FormLabel>
          <FormControl>
            <MultiSelectCombobox
              label="Produk"
              options={productsMemo!}
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
                handleRenderSelectedItem(field.value, productsMemo!)
              }
              aria-label="Filter by products"
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
