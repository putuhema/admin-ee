"use client";

import { useForm } from "react-hook-form";
import {
  BookPreparationData,
  bookPreparationsSchema,
} from "@/features/book-preparations/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import NameSearchInput from "@/components/name-search-input";
import ProgramSelect from "@/components/programs-select";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Book } from "lucide-react";
import { useCreateBookPreparations } from "../../queries/post-book-preparations";

export default function BookPreparationsForm() {
  const { mutate } = useCreateBookPreparations();
  const form = useForm<BookPreparationData>({
    resolver: zodResolver(bookPreparationsSchema),
    defaultValues: {
      programId: 1,
      studentId: "",
      notes: "",
    },
  });

  const onSubmit = (data: BookPreparationData) => {
    mutate(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <NameSearchInput form={form} name="studentId" />
          <ProgramSelect form={form} />
        </div>
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catatan</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Contoh: Level 5, Ski 3, Tes Mathe dll."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Cantumkan level berikutnya atau jenis buku yang akan disiapkan.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          <Book />
          Siapkan Buku
        </Button>
      </form>
    </Form>
  );
}
