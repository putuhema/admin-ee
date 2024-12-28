import React from "react";

import { useGetInvoices } from "../queries/use-get-invoices";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import InvoiceAction from "./invoice-action";

export default function InvoiceTable() {
  const { data, isPending } = useGetInvoices();

  if (isPending) {
    return <div>loading...</div>;
  }

  if (!data) {
    return <div>no data.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="uppercase">
          <TableHead>Name</TableHead>
          <TableHead>Program</TableHead>
          <TableHead className="text-center">Paket</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.invoices.map((inv, idx) => (
          <TableRow key={idx}>
            <TableCell>{inv.student?.nickname}</TableCell>
            <TableCell className="capitalize">
              {inv.programs.map((p, i) => (
                <div key={i}>{p.program!.name}</div>
              ))}
            </TableCell>

            <TableCell className="capitalize text-center">
              {inv.programs.map((p, i) => (
                <div key={i}>{p.invoices[0].package!.name}</div>
              ))}
            </TableCell>
            <TableCell className="flex items-center justify-center">
              <InvoiceAction />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
