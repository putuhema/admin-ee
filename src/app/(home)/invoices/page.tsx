import React from "react";
import InvoiceDrawer from "@/features/invoices/components/invoice-drawer";
import InvoiceList from "@/features/invoices/components/invoice-lists";

export default function FeePage() {
  return (
    <main>
      <InvoiceList />
      <InvoiceDrawer />
    </main>
  );
}
