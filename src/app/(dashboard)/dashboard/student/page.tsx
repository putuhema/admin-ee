import Table from "@/features/students/data-table/table";
import Link from "next/link";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getStudents } from "@/features/students/hooks/use-get-students";
import { buttonVariants } from "@/components/ui/button";
import { FileUser } from "lucide-react";

export default async function StudentPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["students"],
    queryFn: getStudents,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="space-y-2 w-full">
        <Link
          href="/dashboard/student/form"
          className={buttonVariants({
            variant: "outline",
            size: "lg",
            className: "ml-auto",
          })}
        >
          <FileUser />
          Form
        </Link>
        <Table />
      </main>
    </HydrationBoundary>
  );
}
