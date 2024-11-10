"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { enrollmentSchema, EnrollmentType } from "@/features/enrollment/schema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function EnrollmentForm() {
  const form = useForm<EnrollmentType>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      enrollmentDate: new Date(),
      package: 0,
      packageTaken: 0,
      studentId: "",
      subjectId: "",
    },
  });

  const onSubmit = (data: EnrollmentType) => {
    console.log(data);
  };

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
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter student name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
