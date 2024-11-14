import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getPrograms } from "@/features/programs/hooks/get";
import Table from "@/features/programs/data-table/table";

export default async function SubjectPage() {
  const queryClient = new QueryClient();

  queryClient.prefetchQuery({
    queryKey: ["programs"],
    queryFn: getPrograms,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main>
        <Table />
      </main>
    </HydrationBoundary>
  );
}
