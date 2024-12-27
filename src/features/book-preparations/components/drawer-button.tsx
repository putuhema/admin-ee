"use client";
import React from "react";

import { Button } from "@/components/ui/button";
import { BookPlus, FilePlus } from "lucide-react";
import useOpenDrawer from "../hooks/user-open-drawer";
import { usePathname } from "next/navigation";
import useOpenInvoiceDrawer from "@/features/invoices/hooks/use-open-drawer";

export default function DrawerButton() {
  const pathname = usePathname();
  const pathWithButton = ["/bookprep", "/invoices"];

  const { onOpen } = useOpenDrawer();
  const { onOpen: onOpenInvoice } = useOpenInvoiceDrawer();
  return (
    pathWithButton.includes(pathname) && (
      <div className="absolute z-50 left-0 -top-20 p-4">
        <Button
          onClick={() => {
            if (pathname === "/bookprep") {
              onOpen();
            } else {
              onOpenInvoice();
            }
          }}
          className="rounded-full h-12 w-12"
        >
          {pathname === "/bookprep" ? <BookPlus /> : <FilePlus />}
          <span className="sr-only">Open Drawer</span>
        </Button>
      </div>
    )
  );
}
