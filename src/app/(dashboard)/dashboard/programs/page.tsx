import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getPrograms } from "./_features/hooks/get";
import Table from "./_features/data-table/table";

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
