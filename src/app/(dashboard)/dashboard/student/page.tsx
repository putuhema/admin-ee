import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getStudents } from "@/features/students/queries/use-get-students";
import Table from "@/features/students/components/student-table";
import { StudentFormSheetTrigger } from "@/features/students/components/student-sheet-trigger";

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
          <StudentFormSheetTrigger />
        </div>
        <Table />
      </main>
    </HydrationBoundary>
  );
}
