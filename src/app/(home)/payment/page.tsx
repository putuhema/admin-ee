import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import PaymentForm from "./form";
import { getSubjects } from "@/features/subjects/hooks/use-get-subjects";

export default async function StudentFormPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="w-full">
        <h1 className="text-center text-2xl font-bold">Student Form</h1>
        <PaymentForm />
      </main>
    </HydrationBoundary>
  );
}
