"use client";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { paymentSchema } from "@/lib/zod-schema";
import { useGetSubjects } from "@/features/subjects/hooks/use-get-subjects";
import NameSearchInput from "@/components/name-search-input";

export default function PaymentForm() {
  const { data: subjects } = useGetSubjects();
  const [paymentType, setPaymentType] = React.useState("");

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      studentId: "",
      type: "",
      amount: 0,
      subjectId: "",
      level: "",
      date: new Date(),
      packet: 0,
    },
  });

  const onSubmit = (formData: z.infer<typeof paymentSchema>) => {
    console.log(formData);
  };

  return (
    <div className="flex justify-center lg:mx-auto w-full px-4 lg:px-0 lg:max-w-lg items-center p-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full p-2 lg:p-8"
        >
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col gap-2">
                  <FormLabel>Tanggal Pembayaran</FormLabel>
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
                      <PopoverContent className="w-full p-0" align="end">
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

          <div className="flex gap-2 justify-between w-full">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Jenis Pembayaran</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setPaymentType(value);
                      }}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Jenis Pembayaran" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="montly">Spp</SelectItem>
                        <SelectItem value="book">Buku</SelectItem>
                        <SelectItem value="certificate">Sertifikat</SelectItem>
                        <SelectItem value="medal">Medali</SelectItem>
                        <SelectItem value="trophy">Tropi</SelectItem>
                        <SelectItem value="bag">Tas Bimbel</SelectItem>
                        <SelectItem value="clothes">Baju Bimbel</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subjectId"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
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
          </div>
          {paymentType === "montly" && (
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="packet"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Paket</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(parseInt(value));
                        }}
                        defaultValue={field.value?.toString()}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Paket" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="4">4 Kali</SelectItem>
                          <SelectItem value="8">8 Kali</SelectItem>
                          <SelectItem value="12">12 Kali</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Kuantitas</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(parseInt(value));
                        }}
                        defaultValue={field.value?.toString()}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Kuantitas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Kali</SelectItem>
                          <SelectItem value="2">2 Kali</SelectItem>
                          <SelectItem value="3">3 Kali</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          {paymentType === "book" && (
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Level</FormLabel>
                  <FormControl>
                    <Input placeholder="contoh 5" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
