import { getSubjects } from "@/lib/subjects";
import StudentForm from "./client";
import { Suspense } from "react";

export default async function StudentFormPage() {
  const subjects = await getSubjects();

  return (
    <main className="w-full">
      <h1 className="text-center text-2xl font-bold">Student Form</h1>
      <Suspense>
        <StudentForm subjects={subjects} />
      </Suspense>
    </main>
  );
}
