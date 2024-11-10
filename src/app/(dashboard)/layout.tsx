import { AppSidebar } from "@/components/app-sidebar";
import SidebarHeader from "@/components/nav-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { UserType } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar user={session.user as unknown as  UserType} />
      <SidebarInset>
        <SidebarHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
