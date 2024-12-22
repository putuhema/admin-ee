import MainNav from "@/components/main-nav";
import { UserButton } from "@/components/user-button";
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
    <main className="p-4 mt-10 pb-32">
      <div className="fixed top-0 right-0 p-4">
        <UserButton user={session.user as unknown as UserType} />
      </div>
      <MainNav user={session.user as unknown as UserType} />
      {children}
    </main>
  );
}
