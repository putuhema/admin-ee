import * as React from "react";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getEnrollment } from "@/features/enrollment/queries/use-get-enrollment";
import EnrollmentList from "@/features/enrollment";

export default async function EnrollmentPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["enrollments"],
    queryFn: getEnrollment,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EnrollmentList />
    </HydrationBoundary>
  );
}
