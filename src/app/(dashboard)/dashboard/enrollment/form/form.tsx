"use client";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

import { CalendarIcon } from "lucide-react";

import { useForm } from "react-hook-form";
import { enrollmentSchema, EnrollmentType } from "@/features/enrollment/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import NameSearchInput from "@/components/name-search-input";
import { useGetSubjects } from "@/features/subjects/hooks/use-get-subjects";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useGetProductCategory } from "@/features/products/hooks/use-get-product-category";
import { Textarea } from "@/components/ui/textarea";
import { usePostEnrollment } from "@/features/enrollment/hooks/use-post-enrollment";
import React from "react";

export default function EnrollmentForm() {
  const { data: subjects } = useGetSubjects();
  const { data: productCategory } = useGetProductCategory();

  const mutatation = usePostEnrollment();

  const form = useForm<EnrollmentType>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      enrollmentDate: new Date(),
      package: 4,
      packageTaken: 1,
      studentId: "",
      subjectId: "",
      paymentType: "",
      notes: "",
    },
  });

  const paymentType = form.watch("paymentType");
  const subject = form.watch("subjectId");

  const onSubmit = (data: EnrollmentType) => {
    mutatation.mutate(data);
  };

  React.useEffect(() => {
    if (mutatation.isSuccess) {
      form.reset();
    }
  }, [mutatation.isSuccess, form]);

  return (
    <div>
      <div className="max-w-2xl mx-auto py-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold">New Enrollment</h2>
            <p className="text-muted-foreground">
              Add a new student enrollment
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="enrollmentDate"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col gap-2">
                      <FormLabel>Tanggal Masuk</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <NameSearchInput form={form} name="studentId" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="subjectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Program</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subjects?.map((subject) => (
                            <SelectItem
                              key={subject.id}
                              value={subject.id.toString()}
                            >
                              {subject.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jenis Pembayaran</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger disabled={!subject}>
                            <SelectValue placeholder="Pilih Jenis Pembayaran" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {productCategory?.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.name!}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {paymentType === "Layanan Berlangganan" && (
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="package"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Paket</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          defaultValue={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="4">Paket 4</SelectItem>
                            <SelectItem value="8">Paket 8</SelectItem>
                            <SelectItem value="12">Paket 12</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="packageTaken"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ambil Paket</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          defaultValue={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">Paket 1</SelectItem>
                            <SelectItem value="2">Paket 2</SelectItem>
                            <SelectItem value="3">Paket 3</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Catatan untuk {paymentType}{" "}
                      <span className="text-xs text-muted-foreground">
                        (optional)
                      </span>
                    </FormLabel>
                    <Textarea {...field} className="placeholder:text-sm" />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={mutatation.isPending} type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
