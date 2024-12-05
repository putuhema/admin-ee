import { auth } from "@/lib/auth";
import { UserType } from "@/db/schema";
import { cookies, headers } from "next/headers";

import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "@/components/app-sidebar";
import SidebarHeader from "@/components/nav-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import SheetProvider from "@/providers/sheet.provider";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { programQueryOptions } from "@/features/programs/hooks/get";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const queryClient = new QueryClient();

  queryClient.prefetchQuery(programQueryOptions);

  if (!session) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <AppSidebar user={session.user as unknown as UserType} />
      </HydrationBoundary>
      <SidebarInset>
        <SidebarHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
          <SheetProvider />
        </div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
