"use client";

import * as React from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { studentSchema } from "@/features/students/schema";
import { DateFields } from "./form-fields/date-field";
import { InputField } from "./form-fields/input-field";
import { EmailField } from "./form-fields/email-field";
import { NoteField } from "./form-fields/note-field";
import { useSheetStore } from "@/lib/store";

import { usePostStudents } from "@/features/students/queries/use-post-students";
import { StudentResponse } from "@/features/students/queries/use-get-student";
import useEditStudent from "../../hooks/use-edit-student";
import { useUpdateStudent } from "../../queries/update-student";

interface StudentFormProps {
  student?: StudentResponse;
}

export function StudentForm({ student }: StudentFormProps) {
  const { closeSheet } = useSheetStore();
  const { onClose } = useEditStudent();

  const mutation = usePostStudents();
  const { mutate: updateStudent } = useUpdateStudent();

  const form = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: student?.name || "",
      nickname: student?.nickname || "",
      dateOfBirth: new Date(student?.dateOfBirth || new Date()),
      email: student?.email || "",
      additionalInfo: student?.additionalInfo || "",
      address: student?.address || "",
      phoneNumber: student?.phoneNumber || "",
      notes: student?.notes || "",
    },
  });

  async function onSubmit(data: z.infer<typeof studentSchema>) {
    try {
      if (student) {
        updateStudent({ id: student.id, data });
        onCloseSheet();
      } else {
        mutation.mutate(data);
      }

      form.reset();
    } catch (error) {
      console.error("Erron in student creation:", error);
    }
  }

  const onCloseSheet = () => {
    form.reset();
    student ? onClose() : closeSheet("STUDENT_FORM");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <InputField
          required
          form={form}
          name="name"
          label="Name"
          placeholder="Name"
        />
        <InputField
          required
          form={form}
          name="nickname"
          label="Nickname"
          placeholder="Nickname"
        />
        <DateFields form={form} name="dateOfBirth" label="Date of Birth" />
        <InputField
          required
          form={form}
          name="address"
          label="Address"
          placeholder="Address"
        />
        <EmailField form={form} />
        <InputField
          form={form}
          name="phoneNumber"
          label="Phone Number"
          placeholder="ex. 082444555666"
        />
        <InputField
          form={form}
          name="additionalInfo"
          label="Additional Information"
          placeholder="Additional Information"
        />
        <NoteField form={form} />
        <div className="inline-flex gap-4 items-center">
          <Button
            variant="outline"
            type="button"
            onClick={onCloseSheet}
            aria-label="Cancel form"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            isLoading={form.formState.isSubmitting}
            aria-label="Create student"
          >
            {student ? "Edit" : "Create"} Student
          </Button>
        </div>
      </form>
    </Form>
  );
}
