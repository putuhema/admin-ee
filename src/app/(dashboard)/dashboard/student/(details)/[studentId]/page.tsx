"use client";

import { Separator } from "@/components/ui/separator";
import { useGetStudent } from "@/features/students/queries/use-get-student";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function StudentId() {
  const { studentId } = useParams();

  const { data: student, isLoading } = useGetStudent(Number(studentId ?? ""));

  if (isLoading) {
    return (
      <main className="h-screen w-full flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </main>
    );
  }

  if (!student) {
    return <div>Student not found</div>;
  }

  return (
    <div className="flex-1 p-4 rounded-md">
      <div className="flex gap-2">
        <div className="w-[200px] mx-auto">
          <Image
            src="/images/placeholder.jpg"
            width={100}
            height={100}
            alt="placeholder.jpg"
          />
        </div>
        <div className="flex-1">
          <p className="font-bold text-lg">
            {student.name} ({student.nickname})
          </p>
          <div className="grid grid-cols-2 gap-2 md:max-w-[400px] space-y-4">
            <p>Address</p>
            <p>{student.address}</p>
            <p>Date of Birth</p>
            <p>{format(new Date(student.dateOfBirth), "PPP") ?? "-"}</p>
            <p>Phone Number</p>
            <p>{student.phoneNumber || "-"}</p>
            <p>Email</p>
            <p>{student.email || "-"}</p>
            <div className="col-span-2">
              <p className="font-bold text-xl">Guardian(s)</p>
              <Separator />
            </div>
            <p>Name</p>
            <p>{student.guardian.name || "-"}</p>
            <p>Primary Guardian</p>
            <p>{student.guardian.isPrimary ? "yes" : "no"}</p>
            <p>Relatioship</p>
            <p>{student.guardian.relationship || "-"}</p>
            <p>Occupation</p>
            <p>{student.guardian.occupation || "-"}</p>
            <p>Address</p>
            <p>{student.guardian.address || "-"}</p>
            <p>Phone Number</p>
            <p>{student.guardian.phoneNumber || "-"}</p>
            <p>Email</p>
            <p>{student.guardian.email || "-"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
