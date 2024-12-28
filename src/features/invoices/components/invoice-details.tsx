"use client";

import React from "react";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import useOpenInvoiceDetailDrawer from "../hooks/use-open-details";
import DetailsContent from "./details-content";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function InvoiceDetails() {
  const { open, onClose } = useOpenInvoiceDetailDrawer();

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="uppercase">Kartu Iuran</DrawerTitle>
          <div className="inline-flex justify-end ">
            <p>
              {format(new Date(), "EEEE, dd MMMM yyy", {
                locale: id,
              })}
            </p>
          </div>
        </DrawerHeader>
        <div className="p-4 pb-10">
          <DetailsContent />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
