import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FieldValues, UseFormReturn, Path, PathValue } from "react-hook-form";

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  className?: string | undefined;
};

export default function InputCustomNumber<T extends FieldValues>({
  form,
  name,
  label,
  className,
}: Props<T>) {
  const formatRupiah = (str: string) => {
    const number = str.replace(/[^\d.]/g, "");
    const [whole, decimal] = number.split(".");
    const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return decimal ? `${formattedWhole}.${decimal}` : formattedWhole;
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            "flex flex-row items-center justify-between",
            className
          )}
        >
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="flex items-center">
              <code className="px-2 py-1 h-9 text-sm grid place-content-center font-bold bg-accent text-muted-foreground border rounded-l-md border-r-0">
                Rp.
              </code>
              <Input
                {...field}
                className="rounded-l-none"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const formattedValue = formatRupiah(inputValue);
                  form.setValue(name, formattedValue as PathValue<T, Path<T>>);
                }}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
