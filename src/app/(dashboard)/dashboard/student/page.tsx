import Table from "@/features/students/data-table/table";
import Link from "next/link";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getStudents } from "@/features/students/hooks/use-get-students";
import { buttonVariants } from "@/components/ui/button";

export default async function StudentPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["students"],
    queryFn: getStudents,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="space-y-2 w-full">
        <div className="flex items-center justify-end">
          <Link
            href="/dashboard/student/form"
            className={buttonVariants({
              variant: "ghost",
              className: "underline",
            })}
          >
            Student Form
          </Link>
        </div>
        <Table />
      </main>
    </HydrationBoundary>
  );
}
