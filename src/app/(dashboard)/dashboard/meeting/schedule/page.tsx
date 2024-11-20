import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import DynamicSchedule from "@/features/meeting/components/schedule/dynamic";
import { programQueryOptions } from "@/features/programs/hooks/get";
import { studentQueryOptions } from "@/features/students/queries/use-get-students";

export default async function SchedulePage() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery(programQueryOptions),
    queryClient.prefetchQuery(studentQueryOptions),
  ]);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DynamicSchedule />;
    </HydrationBoundary>
  );
}
