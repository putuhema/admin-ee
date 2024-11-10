"use client";

import * as React from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
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

import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetSubjects } from "@/features/subjects/hooks/use-get-subjects";
import { Separator } from "@/components/ui/separator";
import { pricingSchema } from "@/features/subjects/schema";
import { usePostSubjectPricing } from "@/features/subjects/hooks/use-post-pricing";
import { Loader2 } from "lucide-react";
import { useGetSubjectPricingById } from "@/features/subjects/hooks/use-get-pricing-by-id";

export default function PricingForm() {
  const [currentSubject, setCurrentSubject] = React.useState("");
  const { data: subjects } = useGetSubjects();
  const form = useForm<z.infer<typeof pricingSchema>>({
    resolver: zodResolver(pricingSchema),
    defaultValues: {
      subjectId: 0,
      bookFee: "",
      monthlyFee: "",
      certificateFee: "",
      medalFee: "",
      trophyFee: "",
    },
  });

  const subjectId = form.watch("subjectId");
  const { data: pricingData } = useGetSubjectPricingById(subjectId.toString());

  React.useEffect(() => {
    if (subjectId !== 0 && pricingData) {
      form.setValue(
        "bookFee",
        formatRupiah(pricingData.fee.book?.toString() || "0")
      );
      form.setValue(
        "monthlyFee",
        formatRupiah(pricingData.fee.monthly?.toString() || "0")
      );
      form.setValue(
        "certificateFee",
        formatRupiah(pricingData.fee.certificate?.toString() || "0")
      );
      form.setValue(
        "medalFee",
        formatRupiah(pricingData.fee.medal?.toString() || "0")
      );
      form.setValue(
        "trophyFee",
        formatRupiah(pricingData.fee.trophy?.toString() || "0")
      );
    } else {
      form.setValue("bookFee", "");
      form.setValue("monthlyFee", "");
      form.setValue("certificateFee", "");
      form.setValue("medalFee", "");
      form.setValue("trophyFee", "");
    }
  }, [subjectId, pricingData, form]);

  const onCurrentSubjectChange = (subjectId: number) => {
    const currentSubject = subjects && subjects.find((s) => s.id === subjectId);
    setCurrentSubject(currentSubject ? currentSubject.name! : "");
  };

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

  const mutation = usePostSubjectPricing();

  const onSubmit = (values: z.infer<typeof pricingSchema>) => {
    mutation.mutate({
      ...values,
      bookFee: convertToNumber(values.bookFee),
      monthlyFee: convertToNumber(values.monthlyFee),
      certificateFee: convertToNumber(values.certificateFee),
      medalFee: convertToNumber(values.medalFee),
      trophyFee: convertToNumber(values.trophyFee),
    });
  };

  React.useEffect(() => {
    if (mutation.isSuccess && subjects) {
      form.reset();
    }
  }, [mutation.isSuccess, form, subjects]);

  return (
    <div className="max-w-lg mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="subjectId"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(parseInt(value));
                      onCurrentSubjectChange(parseInt(value));
                    }}
                    defaultValue={field.value.toString()}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects &&
                        subjects.map((subject) => (
                          <SelectItem
                            key={subject.id}
                            value={subject.id.toString()}
                            className="capitalize"
                          >
                            {subject.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <p className="text-muted-foreground">
              Set Price for{" "}
              <span className="capitalize text-foreground text-lg tracking-widest">
                {currentSubject}
              </span>
            </p>
            <Separator />
            <FormField
              control={form.control}
              name="bookFee"
              render={({ field }) => (
                <FormItem className="grid grid-cols-2 items-center">
                  <FormLabel>Book Price</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <code className="block px-1 py-1 h-9 font-bold bg-accent text-muted-foreground border rounded-l-md border-r-0">
                        Rp.
                      </code>
                      <Input
                        {...field}
                        disabled={!currentSubject}
                        className="rounded-l-none"
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          const formattedValue = formatRupiah(inputValue);
                          form.setValue("bookFee", formattedValue);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="monthlyFee"
              render={({ field }) => (
                <FormItem className="grid grid-cols-2 items-center">
                  <FormLabel>Monthly Fee</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <code className="block px-1 py-1 h-9 font-bold bg-accent text-muted-foreground border rounded-l-md border-r-0">
                        Rp.
                      </code>
                      <Input
                        {...field}
                        disabled={!currentSubject}
                        className="rounded-l-none"
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          const formattedValue = formatRupiah(inputValue);
                          form.setValue("monthlyFee", formattedValue);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="certificateFee"
              render={({ field }) => (
                <FormItem className="grid grid-cols-2 items-center">
                  <FormLabel>Certificate Fee</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <code className="block px-1 py-1 h-9 font-bold bg-accent text-muted-foreground border rounded-l-md border-r-0">
                        Rp.
                      </code>
                      <Input
                        {...field}
                        disabled={!currentSubject}
                        className="rounded-l-none"
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          const formattedValue = formatRupiah(inputValue);
                          form.setValue("certificateFee", formattedValue);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="medalFee"
              render={({ field }) => (
                <FormItem className="grid grid-cols-2 items-center">
                  <FormLabel>Medals Fee</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <code className="block px-1 py-1 h-9 font-bold bg-accent text-muted-foreground border rounded-l-md border-r-0">
                        Rp.
                      </code>
                      <Input
                        {...field}
                        disabled={!currentSubject}
                        className="rounded-l-none"
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          const formattedValue = formatRupiah(inputValue);
                          form.setValue("medalFee", formattedValue);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="trophyFee"
              render={({ field }) => (
                <FormItem className="grid grid-cols-2 items-center">
                  <FormLabel>Trophy Fee</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <code className="block px-1 py-1 h-9 font-bold bg-accent text-muted-foreground border rounded-l-md border-r-0">
                        Rp.
                      </code>
                      <Input
                        {...field}
                        disabled={!currentSubject}
                        className="rounded-l-none"
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          const formattedValue = formatRupiah(inputValue);
                          form.setValue("trophyFee", formattedValue);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={mutation.isPending} type="submit">
            {mutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Save"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
