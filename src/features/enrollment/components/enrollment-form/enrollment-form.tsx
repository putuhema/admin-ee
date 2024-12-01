"use client";

import * as React from "react";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { enrollmentSchema, EnrollmentData } from "@/features/enrollment/schema";

import NameSearchInput from "@/components/name-search-input";
import EntryDateFields from "./form-fields/entry-date";
import ProgramFields from "./form-fields/programs-fields";
import SelectPackages from "./form-fields/select-packages";
import SelectQuantity from "./form-fields/select-quantity";
import MultiSelectExtras from "./form-fields/multi-select-extras";
import MultiSelectProducts from "./form-fields/multi-select-products";
import Notes from "./form-fields/notes";
import { usePostEnrollment } from "../../hooks/use-post-enrollment";

export default function EnrollmentForm() {
  const mutation = usePostEnrollment();

  const form = useForm<EnrollmentData>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      enrollmentDate: new Date(),
      studentId: "",
      packages: "",
      quantity: 1,
      levels: 1,
      programId: "",
      extras: [],
      products: [],
      notes: "",
    },
  });

  const programId = form.watch("programId");
  const packageId = form.watch("packages");

  const onSubmit = (data: EnrollmentData) => {
    mutation.mutate(data);
  };

  React.useEffect(() => {
    if (mutation.isSuccess) {
      form.reset();
    }
  }, [mutation.isSuccess, form]);

  return (
    <div>
      <div className="max-w-2xl mx-auto py-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold">Form Pendaftaran</h2>
            <p className="text-muted-foreground">
              Tambah Pendaftaran murid baru
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <EntryDateFields form={form} />
              <NameSearchInput form={form} name="studentId" />
              <ProgramFields form={form} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <SelectPackages form={form} />
                <SelectQuantity form={form} packageId={packageId} />
              </div>

              {programId && (
                <div className="space-y-4">
                  <MultiSelectExtras form={form} programId={programId} />
                  <MultiSelectProducts form={form} />
                </div>
              )}
              <Notes form={form} />
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <Loader2 className="animate-spin mr-2 w-6 h-6" />
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
