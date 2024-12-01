import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useSheetStore } from "@/lib/store";
import { useGetProgram } from "../hooks/get";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { usePutProgram } from "../hooks/put";
import { Loader2 } from "lucide-react";
import CustomSheet from "@/components/custom-sheet";
import { Program, programSchema } from "../schema";

export const SHEET_ID = "PROGRAM_FORM_SHEET";

export default function FormSheet({ id }: { id: number }) {
  const { toggleSheet } = useSheetStore();
  const { data } = useGetProgram(id);

  const form = useForm<Program>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      name: "",
      description: "",
      extra: [],
    },
  });

  React.useEffect(() => {
    if (data) {
      form.setValue("id", data.id);
      form.setValue("name", data.name);
      form.setValue("description", data.description);
    }
  }, [data, form]);

  const mutation = usePutProgram();

  const onSubmit = (values: Program) => {
    mutation.mutate({
      ...values,
      id,
    });
  };

  React.useEffect(() => {
    if (mutation.isSuccess) {
      toggleSheet(SHEET_ID + id, false);
    }
  }, [mutation.isSuccess, toggleSheet, id]);

  if (!data) {
    return null;
  }

  return (
    <CustomSheet SHEET_ID={SHEET_ID + id} title="Programs">
      <div className="mt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Programs Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Programs Description</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-[150px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={mutation.isPending} type="submit">
              {mutation.isPending ? (
                <Loader2 className="w-h h-4  animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </CustomSheet>
  );
}
