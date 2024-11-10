"use client";

import { useGetStudent } from "@/features/students/hooks/use-get-student";
import { ChevronRight, Pin } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";

const links = [
  {
    name: "Profile",
    href: "/dashboard/student/1",
  },
  {
    name: "Enrollment",
    href: "/dashboard/student/1/enrollment",
  },
  {
    name: "Payments",
    href: "/dashboard/student/1/payments",
  },
];

export default function StudentId() {
  const { studentId } = useParams();

  const { data: student } = useGetStudent(studentId?.toString() ?? "");

  return (
    <main>
      <div className="flex gap-2 w-full h-full">
        <div className="lg:w-[350px]">
          <ul>
            {links.map((link) => (
              <li
                key={link.name}
                className="inline-flex py-2 pl-2 pr-1 hover:bg-accent rounded-md group justify-between items-center w-full text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {link.name}
                <ChevronRight className="w-4 h-4 transform -translate-x-2 transition-all group-hover:translate-x-0" />
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 bg-accent p-4 rounded-md">
          <div className="flex gap-2">
            <Image
              src="/images/placeholder.jpg"
              width={100}
              height={100}
              alt="placeholder.jpg"
            />
            <div>
              <p className="font-bold text-lg">{student?.name}</p>
              <p className="inline-flex gap-2 items-center">
                <Pin className="w-4 h-4 text-muted-foreground" />{" "}
                <span className="capitalize">{student?.address}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
