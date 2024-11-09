"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  Command,
  FileUser,
  HandCoins,
  SquareTerminal,
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
import { User } from "@/db/schema";

const data = {
  navMain: [
    {
      title: "Students",
      url: "/dashboard/student",
      icon: SquareTerminal,
    },
    {
      title: "Subjects",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Enrollment",
      url: "/dashboard/enrollment",
      icon: FileUser,
    },
    {
      title: "Teachers",
      url: "#",
      icon: BookOpen,
    },
    {
      title: "Payments",
      url: "#",
      icon: HandCoins,
      items: [
        {
          title: "Monthly",
          url: "#",
        },
        {
          title: "Books",
          url: "#",
        },
        {
          title: "Certificate & Trophy",
          url: "#",
        },
      ],
    },
  ],
};

interface Props extends React.ComponentProps<typeof Sidebar> {
  user: User | null;
}

export function AppSidebar({ user, ...props }: Props) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Admin EE</span>
                  <span className="truncate text-xs">Erlangga Education</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
