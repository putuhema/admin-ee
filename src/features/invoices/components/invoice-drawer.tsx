"use client";
import React from "react";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useOpenInvoiceDrawer } from "../hooks/use-open-drawer";
import InvoicesForm from "./invoices-form/invoices-form";

export default function InvoiceDrawer() {
  const { form, onClose } = useOpenInvoiceDrawer();
  return (
    <Drawer open={form} onOpenChange={() => onClose("form")}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Formulir Iuran Bulanan</DrawerTitle>
          <DrawerDescription>
            Silahkah isi formulir berikut untuk membuat iuran bulanan.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 pb-10">
          <InvoicesForm />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
