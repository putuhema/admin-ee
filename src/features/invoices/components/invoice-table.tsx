import React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import InvoiceAction from "./invoice-action";
import { useGetInvoices } from "../queries/use-get-invoices";

export default function InvoiceTable() {
  const { data } = useGetInvoices();

  return (
    <Table>
      <TableCaption>
        {`${data?.summary.studentsWithInvoice} / ${data?.summary.totalStudents} `}
        |
        <span className="italic text-sm mx-2">
          ({data?.summary.percentage})%
        </span>{" "}
        Siswa sudah diberikan iuran.
      </TableCaption>
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
        <TableData />
      </TableBody>
    </Table>
  );
}

function TableData() {
  const { data, isPending } = useGetInvoices();

  if (isPending) {
    return (
      <TableRow>
        <TableCell className="col-span-4 text-center">Loading...</TableCell>
      </TableRow>
    );
  }

  if (!data) {
    return (
      <TableRow>
        <TableCell className="col-span-4 text-center">No Data.</TableCell>
      </TableRow>
    );
  }
  return (
    <>
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
            <InvoiceAction id={inv.student!.id} />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
