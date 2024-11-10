import { getSubjects } from "@/features/subjects/hooks/use-get-subjects";
import EnrollmentForm from "./form";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getProductCategory } from "@/features/products/hooks/use-get-product-category";

export default async function EnrollmentPage() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["subjects"],
      queryFn: getSubjects,
    }),
    queryClient.prefetchQuery({
      queryKey: ["products-category"],
      queryFn: getProductCategory,
    }),
  ]);
  return (
    <main>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <EnrollmentForm />
      </HydrationBoundary>
    </main>
  );
}
