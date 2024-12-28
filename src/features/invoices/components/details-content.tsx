import React from "react";
import useOpenInvoiceDetailDrawer from "../hooks/use-open-details";
import { useGetInvoice } from "../queries/use-get-invoice";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import DetailsSekeleton from "./details-skeleton";

export default function DetailsContent() {
  const { id } = useOpenInvoiceDetailDrawer();
  const { data, isPending } = useGetInvoice(id);

  if (isPending) {
    return <DetailsSekeleton />;
  }

  if (!data) {
    return <div>No data</div>;
  }

  const totalAmount = data.reduce((acc, cur) => acc + cur.amount, 0);

  return (
    <div className="border-t border-b py-4  border-dashed">
      <h3 className="font-bold text-lg uppercase">{data[0].student?.name}</h3>
      {data.map((inv) => (
        <div key={inv.id} className="border-b py-2">
          <p className="text-xs text-muted-foreground">{inv.invoiceNumber}</p>
          <div className="grid grid-cols-2">
            <p>Program</p>
            <p className="capitalize">: {inv.program?.name}</p>
          </div>
          <div className="grid grid-cols-2">
            <p>Keterangan</p>
            <p className="capitalize">: Paket {inv.package?.name}</p>
          </div>
          <div className="grid grid-cols-2">
            <p>Harga</p>
            <p className="capitalize">: {formatCurrency(inv.amount ?? 0)}</p>
          </div>
          <div className="grid grid-cols-2">
            <p>Tgl Jatuh Tempo</p>
            <p className="capitalize">: {format(inv.dueDate, "dd/MM/yyy")}</p>
          </div>
        </div>
      ))}

      <div className="grid grid-cols-2 mt-4 font-bold bg-blue-200 pl-2 py-2 rounded-lg">
        <p>Total</p>
        <p>{formatCurrency(totalAmount)}</p>
      </div>
    </div>
  );
}
