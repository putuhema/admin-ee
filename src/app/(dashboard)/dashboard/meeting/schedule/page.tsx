import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import DynamicSchedule from "@/features/meeting/components/schedule/dynamic";
import { programQueryOptions } from "@/features/programs/hooks/get";

export default async function SchedulePage() {
  const queryClient = new QueryClient();

  await Promise.all([queryClient.prefetchQuery(programQueryOptions)]);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DynamicSchedule />;
    </HydrationBoundary>
  );
}
