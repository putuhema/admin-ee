import MainNav from "@/components/main-nav";
import { UserType } from "@/db/schema";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function HomeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  return (
    <main className="p-4 mt-8 pb-32">
      <MainNav user={session.user as unknown as UserType} />
      {children}
    </main>
  );
}
