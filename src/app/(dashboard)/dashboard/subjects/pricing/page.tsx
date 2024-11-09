import * as React from "react";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import Table from "@/features/subjects/data-table/table";
import {
  QUERY_KEY,
  getSubjectPricing,
} from "@/features/subjects/hooks/use-get-pricing";
import Link from "next/link";
import { FileUser } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default async function PricingPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: QUERY_KEY,
    queryFn: getSubjectPricing,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="space-y-2 w-full">
        <Link
          href="/dashboard/subjects/pricing/form"
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
