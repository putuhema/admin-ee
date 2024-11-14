import { packageOptions } from "@/features/meeting-package/api/get-packages";
import { getPrograms } from "@/features/programs/hooks/get";
import EnrollmentForm from "./form";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { productsQueryOptions } from "@/features/products/api/use-get-products";

export default async function EnrollmentPage() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["programs"],
      queryFn: getPrograms,
    }),
    queryClient.prefetchQuery(packageOptions),
    queryClient.prefetchQuery(productsQueryOptions),
  ]);
  return (
    <main>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <EnrollmentForm />
      </HydrationBoundary>
    </main>
  );
}
