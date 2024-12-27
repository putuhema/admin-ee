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
import { InvoiceData } from "@/features/invoices/schema";
import { useGetPackages } from "@/features/meeting-package/api/get-packages";
import { UseFormReturn } from "react-hook-form";

interface SelectPackagesProps {
  form: UseFormReturn<InvoiceData>;
}

export default function SelectPackages({ form }: SelectPackagesProps) {
  const { data: packages } = useGetPackages();

  return (
    <FormField
      control={form.control}
      name="packageId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Pilih Paket
            <span className="text-destructive ml-1" aria-hidden="true">
              *
            </span>
          </FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select Packages" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {packages?.map((p) => (
                <SelectItem key={p.id} value={p.id.toString()}>
                  {p.name}
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
