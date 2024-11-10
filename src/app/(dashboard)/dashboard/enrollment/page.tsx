import * as React from "react";

import Table from "@/features/enrollment/data-table/table";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getEnrollment } from "@/features/enrollment/hooks/use-get-enrollment";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default async function EnrollmentPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["enrollments"],
    queryFn: getEnrollment,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="space-y-2 w-full">
        <div className="flex items-center justify-end">
          <Link
            href="/dashboard/enrollment/form"
            className={buttonVariants({
              variant: "ghost",
              className: "underline",
            })}
          >
            Add Enrollment
          </Link>
        </div>

        <Table />
      </main>
    </HydrationBoundary>
  );
}
