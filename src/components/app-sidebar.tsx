"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  CalendarFold,
  Command,
  FileUser,
  User,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserType } from "@/db/schema";
import Link from "next/link";
import { useGetPrograms } from "@/features/programs/hooks/get";

const data = {
  navMain: [
    {
      title: "Students",
      url: "/dashboard/student",
      icon: User,
    },
    {
      title: "Programs",
      url: "/dashboard/programs",
      icon: Bot,
    },
    {
      title: "Enrollment",
      url: "/dashboard/enrollment",
      icon: FileUser,
      items: [
        {
          title: "Invoinces",
          url: "/dashboard/enrollment/invoices",
        },
      ],
    },
    {
      title: "Meeting",
      url: "/dashboard/meeting",
      icon: CalendarFold,
      items: [
        {
          title: "Schedule",
          url: "/dashboard/meeting/schedule",
        },
      ],
    },
    {
      title: "Teachers",
      url: "#",
      icon: BookOpen,
    },
    {
      title: "Book Preparations",
      url: "/dashboard/book-preparations",
      icon: BookOpen,
    },
  ],
};

interface Props extends React.ComponentProps<typeof Sidebar> {
  user: UserType | null;
}

export function AppSidebar({ user, ...props }: Props) {
  const { data: programs } = useGetPrograms();

  const navData = React.useMemo(() => {
    if (programs) {
      const programsLinks = programs.map((program) => ({
        title: program.name,
        url: `/dashboard/programs/${program.id}`,
      }));

      return data.navMain.map((item) =>
        item.title === "Programs" ? { ...item, items: programsLinks } : item
      );
    }
    return data.navMain;
  }, [programs]);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Admin EE</span>
                  <span className="truncate text-xs">Erlangga Education</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navData} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
