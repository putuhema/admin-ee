import Link from "next/link";
import React from "react";
import { UserButton } from "./user-button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { UserType } from "@/db/schema";

const mainNav = [
  {
    title: "Home",
    link: "/",
  },
  {
    title: "Payment",
    link: "/payment",
  },
];

export default async function MainNav() {

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }
  return (
    <div className="w-full fixed top-0 left-0">
      <nav className="w-full flex justify-between items-center p-2 bg-background border text-foreground">
        <ul className="flex gap-4 p-2">
          {mainNav.map((main) => (
            <Link key={main.title} href={main.link}>
              {main.title}
            </Link>
          ))}
        </ul>
        <UserButton  user={session.user as unknown as  UserType}/>
      </nav>
    </div>
  );
}
