"use client";

import * as React from "react";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import NameSearchInput from "@/components/name-search-input";
import ProgramFields from "./form-fields/programs-fields";
import SelectPackages from "./form-fields/select-packages";
import SelectQuantity from "./form-fields/select-quantity";
import Notes from "./form-fields/notes";
import DateFields from "./form-fields/entry-date";
import { InvoiceData, invoiceSchema } from "@/features/invoices/schema";
import { useCreateInvoices } from "../../queries/use-post-invoices";

export default function InvoicesForm() {
  const mutation = useCreateInvoices();

  const form = useForm<InvoiceData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      studentId: "",
      packageId: "",
      programId: "",
      quantity: 1,
      date: new Date(),
      notes: "",
    },
  });

  const packageId = form.watch("packageId");

  const onSubmit = (data: InvoiceData) => {
    mutation.mutate(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <NameSearchInput form={form} name="studentId" />
        <ProgramFields form={form} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <SelectPackages form={form} />
          <SelectQuantity form={form} packageId={packageId} />
        </div>
        <DateFields form={form} />
        <Notes form={form} />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
