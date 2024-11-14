"use client";

import * as React from "react";

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

import { CalendarIcon, Loader2 } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import NameSearchInput from "@/components/name-search-input";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  useGetProgramExtra,
  useGetPrograms,
} from "@/features/programs/hooks/get";
import { enrollmentSchema, EnrollmentType } from "@/features/enrollment/schema";
import { useGetPackages } from "@/features/meeting-package/api/get-packages";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { MultiSelectCombobox } from "@/components/multi-combobox";
import { useGetProducts } from "@/features/products/api/use-get-products";
import { usePostEnrollment } from "@/features/enrollment/hooks/use-post-enrollment";
import { useGetProgramLevels } from "@/features/programs/hooks/use-get-program-levels";
import { Skeleton } from "@/components/ui/skeleton";

export default function EnrollmentForm() {
  const { data: programs } = useGetPrograms();
  const { data: packages } = useGetPackages();

  const mutation = usePostEnrollment();

  const form = useForm<EnrollmentType>({
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
  const { data: programExtra } = useGetProgramExtra(Number(programId), true);
  const { data: products } = useGetProducts();
  const { data: programLevels, isLoading: programLevelsLoading } =
    useGetProgramLevels({
      programId: Number(programId),
    });

  const extras = React.useMemo(() => {
    return (
      programExtra &&
      programExtra.map((extra) => ({
        label: extra.type,
        value: extra.id.toString(),
      }))
    );
  }, [programExtra]);

  const productsMemo = React.useMemo(() => {
    return (
      products &&
      products.map((product) => ({
        label: product.name,
        value: product.id.toString(),
      }))
    );
  }, [products]);

  const handleRenderSelectedItem = (
    values: string[],
    options: { label: string; value: string }[],
    items: number = 3
  ): string => {
    if (values.length === 0) return "";

    if (values.length <= items) {
      return options
        .reduce<string[]>((accumulator, option) => {
          if (values.includes(option.value)) {
            accumulator.push(option.label);
          }
          return accumulator;
        }, [])
        .join(", ");
    }

    return `${values.length} selected`;
  };

  const onSubmit = (data: EnrollmentType) => {
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
            <h2 className="text-2xl font-bold">New Enrollment</h2>
            <p className="text-muted-foreground">
              Add a new student enrollment
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
                  name="programId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Program</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a programs" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {programs?.map((program) => (
                            <SelectItem
                              key={program.id}
                              value={program.id.toString()}
                              className="capitalize"
                            >
                              {program.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {programLevelsLoading ? (
                  <div className="space-y-2">
                    <FormLabel>Levels</FormLabel>
                    <Skeleton className="h-9 w-full" />
                  </div>
                ) : (
                  <>
                    {programLevels && (
                      <FormField
                        control={form.control}
                        name="levels"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Levels</FormLabel>
                            <Select
                              onValueChange={(value) =>
                                field.onChange(Number(value))
                              }
                              defaultValue={field.value.toString()}
                            >
                              <FormControl>
                                <SelectTrigger
                                  disabled={
                                    !programLevels || programLevels.length === 0
                                  }
                                >
                                  <SelectValue placeholder="Select a Levels" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {programLevels.map((lv) => (
                                  <SelectItem
                                    key={lv.id}
                                    value={lv.id.toString()}
                                    className="capitalize"
                                  >
                                    {lv.level}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="packages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Packages</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Packages" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {packages?.map((p) => (
                            <SelectItem key={p.id} value={p.id.toString()}>
                              {p.name}
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
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger disabled={!packageId}>
                            <SelectValue placeholder="Select Quantity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <h3>Extra Items</h3>
                <Separator />
              </div>
              {extras && (
                <div>
                  <FormField
                    control={form.control}
                    name="extras"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Extra</FormLabel>
                        <FormControl>
                          <MultiSelectCombobox
                            label="Program Extra"
                            options={extras!}
                            value={field.value}
                            onChange={field.onChange}
                            renderItem={(option) => (
                              <div
                                role="option"
                                aria-selected={field.value.includes(
                                  option.value
                                )}
                              >
                                {option.label}
                              </div>
                            )}
                            renderSelectedItem={() =>
                              handleRenderSelectedItem(field.value, extras!, 4)
                            }
                            aria-label="Filter by task type"
                            aria-required="false"
                            aria-multiselectable="true"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="products"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Products</FormLabel>
                        <FormControl>
                          <MultiSelectCombobox
                            label="Products"
                            options={productsMemo!}
                            value={field.value}
                            onChange={field.onChange}
                            renderItem={(option) => (
                              <div
                                role="option"
                                aria-selected={field.value.includes(
                                  option.value
                                )}
                              >
                                {option.label}
                              </div>
                            )}
                            renderSelectedItem={() =>
                              handleRenderSelectedItem(
                                field.value,
                                productsMemo!
                              )
                            }
                            aria-label="Filter by task type"
                            aria-required="false"
                            aria-multiselectable="true"
                          />
                        </FormControl>
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
                      Notes <span className="text-xs">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
