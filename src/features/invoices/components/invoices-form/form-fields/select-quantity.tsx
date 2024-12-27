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
import { UseFormReturn } from "react-hook-form";

interface SelectQuantityProps {
  form: UseFormReturn<InvoiceData>;
  packageId: string;
}

export default function SelectQuantity({
  form,
  packageId,
}: SelectQuantityProps) {
  return (
    <FormField
      control={form.control}
      name="quantity"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Banyak Paket Diambil
            <span className="text-destructive ml-1" aria-hidden="true">
              *
            </span>
          </FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value.toString()}
          >
            <FormControl>
              <SelectTrigger disabled={!packageId}>
                <SelectValue placeholder="Select Quantity" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
