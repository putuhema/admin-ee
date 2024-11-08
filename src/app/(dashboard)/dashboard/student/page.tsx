import Table from "@/features/students/data-table/table";
import Link from "next/link";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getStudents } from "@/features/students/hooks/use-get-students";

export default async function StudentPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["students"],
    queryFn: getStudents,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="">
        <Link href="/dashboard/student/form">Form</Link>
        <Table />
      </main>
    </HydrationBoundary>
  );
}
