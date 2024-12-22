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
import { BookPrepData } from "../../queries/get-book-preparation";
import { useUpdateBookPreparation } from "../../queries/put-bookprep";
import useEditBookPreps from "../../hooks/use-edit-dialog";
import usenewBookPreparations from "../../hooks/use-new-preparations";

interface BookPreparationsFormProps {
  bookPrep?: BookPrepData | undefined;
}

export default function BookPreparationsForm({
  bookPrep,
}: BookPreparationsFormProps) {
  const { onClose } = useEditBookPreps();
  const { onClose: closeNewBookPrep } = usenewBookPreparations();

  const { mutate } = useCreateBookPreparations();
  const { mutate: updateBookPrep } = useUpdateBookPreparation();

  const form = useForm<BookPreparationData>({
    resolver: zodResolver(bookPreparationsSchema),
    defaultValues: {
      programId: bookPrep?.program!.id ?? 1,
      studentId: bookPrep?.student!.name ?? "",
      notes: bookPrep?.notes ?? "",
    },
  });

  const onSubmit = (data: BookPreparationData) => {
    if (bookPrep) {
      updateBookPrep({ ...data, id: bookPrep.id });
    } else {
      mutate(data);
    }
    onCloseSheet();
  };

  const onCloseSheet = () => {
    form.reset();
    if (bookPrep) {
      onClose();
    } else {
      closeNewBookPrep();
    }
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
          {bookPrep ? "Update " : "Siapkan Buku"}
        </Button>
      </form>
    </Form>
  );
}
