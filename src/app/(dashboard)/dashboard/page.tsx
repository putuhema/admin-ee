import SignOutButton from "@/components/signout-button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <div>
      <p>{session?.user.email}</p>
      <p>{session?.user.name}</p>
      <SignOutButton />
    </div>
  );
}
