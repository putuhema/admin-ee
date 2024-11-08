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
import { CalendarIcon, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { paymentSchema } from "@/lib/zod-schema";

export default function PaymentPage() {
  const [paymentType, setPaymentType] = React.useState("");
  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      studentId: "",
      type: "",
      amount: 0,
      subject: "",
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
                              !field.value && "text-muted-foreground",
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

          <FormField
            control={form.control}
            name="studentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Murid</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      {...field}
                      type="search"
                      placeholder="Cari nama murid ..."
                      className="pl-10 pr-4 py-2"
                      aria-label="Search names"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                        <SelectItem value="spp">Spp</SelectItem>
                        <SelectItem value="buku">Buku</SelectItem>
                        <SelectItem value="sertifikat">Sertifikat</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mathe">MatHe</SelectItem>
                        <SelectItem value="prisma">Prisma</SelectItem>
                        <SelectItem value="cermat">Cermat</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {paymentType === "spp" && (
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
          {paymentType === "buku" && (
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
