"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function SidebarHeader() {
  const pathname = usePathname();
  const getLinks = pathname.split("/");
  const sliceLinks = getLinks.slice(1, getLinks.length - 1);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {getLinks.length > 0 &&
              sliceLinks.map((link, idx) => {
                return (
                  <React.Fragment key={link}>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink asChild>
                        <Link
                          href={getLinks.slice(0, idx + 2).join("/")}
                          className="capitalize"
                        >
                          {link}
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {sliceLinks.length - 1 !== idx && (
                      <BreadcrumbSeparator className="hidden md:block" />
                    )}
                  </React.Fragment>
                );
              })}
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize">
                {getLinks[getLinks.length - 1]}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
