"use client";
import React from "react";

import Link from "next/link";
import { UserButton } from "./user-button";
import { UserType } from "@/db/schema";
import { useIsClient } from "@uidotdev/usehooks";
import { useIsMobile } from "@/hooks/use-mobile";
import { SegmentedControl } from "@/features/home";

const mainNav = [
  {
    title: "Home",
    link: "/",
  },
  {
    title: "Payment",
    link: "/payment",
  },
  {
    title: "Schedule",
    link: "/schedule",
  },
];

interface MainNavProps {
  user: UserType;
}

export default function MainNav({ user }: MainNavProps) {
  const isClient = useIsClient();
  const isMobile = useIsMobile();

  if (!isClient) {
    return;
  }

  if (isMobile) {
    return (
      <div className="fixed z-50 bottom-0 left-0 w-full">
        <SegmentedControl />
      </div>
    );
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
        <UserButton user={user} />
      </nav>
    </div>
  );
}
