import Link from "next/link";
import React from "react";

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

export default function MainNav() {
  return (
    <div className="w-full fixed top-0 left-0">
      <nav className="w-full flex p-2 bg-background border text-foreground">
        <ul className="flex gap-4 p-2">
          {mainNav.map((main) => (
            <Link key={main.title} href={main.link}>
              {main.title}
            </Link>
          ))}
        </ul>
      </nav>
    </div>
  );
}
