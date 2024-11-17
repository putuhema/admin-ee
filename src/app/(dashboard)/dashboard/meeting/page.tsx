import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { meetingQueryOptions } from "@/features/meeting/api/get-meetings";
import Table from "@/features/meeting/data-table/table";

export default async function MeetingPage() {
  const queryClient = new QueryClient();

  queryClient.prefetchQuery(meetingQueryOptions);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main>
        <Table />
      </main>
    </HydrationBoundary>
  );
}
