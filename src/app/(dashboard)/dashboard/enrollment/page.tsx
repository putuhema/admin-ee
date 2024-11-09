import * as React from "react";

import Table from "@/features/enrollment/data-table/table";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getEnrollment } from "@/features/enrollment/hooks/use-get-enrollment";

export default async function EnrollmentPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["enrollments"],
    queryFn: getEnrollment,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="space-y-2 w-full">
        <Table />
      </main>
    </HydrationBoundary>
  );
}
