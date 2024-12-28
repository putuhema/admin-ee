"use client";

import React from "react";
import InvoiceTable from "./invoice-table";
import InvoiceToolbar from "./invoice-toolbar";

export default function InvoiceList() {
  return (
    <section className="space-y-2">
      <InvoiceToolbar />
      <InvoiceTable />
    </section>
  );
}
