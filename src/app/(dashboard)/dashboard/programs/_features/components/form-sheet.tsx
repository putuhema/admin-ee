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
import { programSchema, Program } from "../schema";
import { Textarea } from "@/components/ui/textarea";
import { usePutProgram } from "../hooks/put";
import { Loader2 } from "lucide-react";
import CustomSheet from "@/components/custom-sheet";

export const SHEET_ID = "PROGRAM_FORM_SHEET";

export default function FormSheet({ id }: { id: number }) {
  const { toggleSheet } = useSheetStore();
  const { data } = useGetProgram(id);

  const form = useForm<Program>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      name: "",
      description: "",
      pricePerMeeting: "",
      extra: [],
    },
  });

  React.useEffect(() => {
    if (data) {
      form.setValue("id", data.id);
      form.setValue("name", data.name);
      form.setValue("description", data.description);
      form.setValue(
        "pricePerMeeting",
        formatRupiah(data.pricePerMeeting.toString())
      );
    }
  }, [data, form]);

  const formatRupiah = (str: string) => {
    const number = str.replace(/[^\d.]/g, "");
    const [whole, decimal] = number.split(".");
    const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return decimal ? `${formattedWhole}.${decimal}` : formattedWhole;
  };

  const convertToNumber = (str: string) => {
    const numberString = str.replace(/[^\d]/g, "");
    const toNumber = parseInt(numberString, 10).toString();
    return !isNaN(parseInt(numberString, 10)) ? toNumber : "0";
  };

  const mutation = usePutProgram();

  const onSubmit = (values: Program) => {
    mutation.mutate({
      ...values,
      id,
      pricePerMeeting: convertToNumber(values.pricePerMeeting),
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
    <CustomSheet
      SHEET_ID={SHEET_ID + id}
      title="Programs"
      desc="Add or Edit Programs"
    >
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
            <FormField
              control={form.control}
              name="pricePerMeeting"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Price</FormLabel>
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
                          form.setValue("pricePerMeeting", formattedValue);
                        }}
                      />
                    </div>
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
