import { ChevronRight } from "lucide-react";
import Link from "next/link";

const links = [
  {
    name: "Profile",
    href: (studentId: number) => `/dashboard/student/${studentId}`,
  },
  {
    name: "Enrollment",
    href: (studentId: number) => `/dashboard/student/${studentId}/enrollment`,
  },
  {
    name: "Payments",
    href: (studentId: number) => `/dashboard/student/${studentId}/payments`,
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <div className="flex gap-2 w-full h-full">
        <div className="lg:w-[350px]">
          <ul>
            {links.map((link) => (
              <Link key={link.name} href={link.href(2)}>
                <li className="inline-flex py-2 pl-2 pr-1 hover:bg-accent rounded-md group justify-between items-center w-full text-muted-foreground hover:text-foreground cursor-pointer">
                  {link.name}
                  <ChevronRight className="w-4 h-4 transform -translate-x-2 transition-all group-hover:translate-x-0" />
                </li>
              </Link>
            ))}
          </ul>
        </div>
        <div className="flex-1 p-4 rounded-md">{children}</div>
      </div>
    </main>
  );
}
