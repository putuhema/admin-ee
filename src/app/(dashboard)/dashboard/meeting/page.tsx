import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { meetingQueryOptions } from "@/features/meeting/queries/get-meetings";
import Table from "@/features/meeting/components/meeting-table";

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
