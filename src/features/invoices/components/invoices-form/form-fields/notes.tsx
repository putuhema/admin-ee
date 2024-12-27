import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { InvoiceData } from "@/features/invoices/schema";
import { UseFormReturn } from "react-hook-form";

interface NotesProps {
  form: UseFormReturn<InvoiceData>;
}

export default function Notes({ form }: NotesProps) {
  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Notes <span className="text-xs">(optional)</span>
          </FormLabel>
          <FormControl>
            <Textarea {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
