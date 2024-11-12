import Link from "next/link";
import StudentForm from "./forms";
import { buttonVariants } from "@/components/ui/button";
import { User2 } from "lucide-react";
import BackButton from "@/components/back-button";

export default async function StudentFormPage() {
  return (
    <main className="w-full">
      <div className="flex items-center justify-between">
        <BackButton />
        <Link
          href="/dashboard/student/guardian"
          className={buttonVariants({
            variant: "link",
          })}
        >
          <User2 /> Guardian(s)
        </Link>
      </div>
      <div className="max-w-lg mx-auto space-y-8">
        <h1 className="text-center text-2xl font-bold">Student Form</h1>
        <StudentForm />
      </div>
    </main>
  );
}
