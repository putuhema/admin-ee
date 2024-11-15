import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import MeetingForm from "./form";
import { programQueryOptions } from "@/features/programs/hooks/get";
import { studentQueryOptions } from "@/features/students/hooks/use-get-students";

export default async function MeetingPage() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery(programQueryOptions),
    queryClient.prefetchQuery(studentQueryOptions),
  ]);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main>
        <MeetingForm />
      </main>
    </HydrationBoundary>
  );
}
