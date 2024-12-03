"use client";
import * as React from "react";
import { useParams } from "next/navigation";
import { useGetStudentEnrollment } from "@/features/students/queries/get-student-enrollment";
import { Loader2 } from "lucide-react";
import StudentCalendar from "@/components/student-calendar";

export default function StudentEnrollmentPage() {
  const { studentId } = useParams();

  const { data: student, isLoading } = useGetStudentEnrollment(
    Number(studentId?.toString()),
  );

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!student) {
    return <div>Student not found</div>;
  }

  return (
    <section className="w-full space-y-4">
      {student.map((se) => (
        <div key={se.id}>
          <div className="flex items-center gap-2">
            <p className="text-xl uppercase">{se.programName}</p>
            <p className="text-sm">
              {se.packageCount! * se.meetingQty} meetings left
            </p>
          </div>
          <StudentCalendar />
        </div>
      ))}
    </section>
  );
}
