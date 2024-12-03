import React from "react";
import useDetailsEnrollment from "../../hooks/use-details-enrollment";
import { useGetEnrollementDetails } from "../../queries/get-enrollment-details";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { formatRupiah } from "@/lib/utils";
import DetailsSkeleton from "./skeleton";
import PaymentDatePicker from "./payment-date-picker";

export default function EnrollmentDetails() {
  const { enrollmentId } = useDetailsEnrollment();

  const { data: details, isLoading } = useGetEnrollementDetails(
    enrollmentId.toString(),
  );

  if (isLoading) {
    return <DetailsSkeleton />;
  }

  if (!details) {
    return <div>no reciept yet.</div>;
  }

  return (
    <section className="w-full space-y-2 p-4 font-mono">
      <div className="border border-b border-dashed" />
      <div className="uppercase flex items-center justify-center gap-4 tracking-widest text-center font-extrabold">
        <p className="text-xl">***</p>
        <p className="text-2xl">Reciept</p>
        <p className="text-xl">***</p>
      </div>

      <div className="flex items-center justify-between text-muted-foreground text-sm">
        <p>PENDAFTARAN #{details.enrollmentId}</p>
        <p className="capitalize">
          {format(
            new Date(details.orderDetails[0].date ?? new Date()),
            "dd/MM/yyy . hh:mm a",
            {
              locale: id,
            },
          )}
        </p>
      </div>
      <div className="border border-b border-dashed" />

      <p className="uppercase font-bold text-center"> {details.studentName}</p>
      <div className="w-full grid grid-cols-2 gap-y-2 gap-x-8">
        <p className="capitalize col-span-2"> {details.prograName}</p>

        {details.orderDetails.map((od) => (
          <React.Fragment key={od.id}>
            <p className="text-muted-foreground">
              {od.quantity} x{" "}
              {(od.packageName && `Paket ${od.packageName}`) ||
                od.extraName ||
                od.productName}
            </p>
            <p className="capitalize">
              : Rp.{" "}
              {formatRupiah(((od.quantity ?? 1) * (od.price ?? 0)).toString())}
              ,-
            </p>

            {(details.packageDiscount ?? 0) > 0 && od.packageName && (
              <>
                <p className="text-muted-foreground pl-4 text-sm">
                  Diskon ({details.packageDiscount}%)
                </p>
                <p className="capitalize text-sm text-muted-foreground">
                  : Rp.
                  {formatRupiah(
                    (
                      (details.packageDiscount! / 100) *
                      details.packagePrice!
                    ).toString(),
                  )}
                  ,-
                </p>
              </>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="border border-b border-dashed" />
      <div className="border border-b border-dashed" />
      <div className="grid grid-cols-2  gap-x-8 font-bold">
        <p className="tracking-widest">TOTAL</p>
        <p>Rp. {formatRupiah((details.orderAmount ?? 0).toString())},-</p>
        <p>Dibayar Tanggal</p>
        {details.paymentStatus === "completed" ? (
          <p>
            {format(new Date(details.paymentDate ?? new Date()), "dd/MM/yyy", {
              locale: id,
            })}
          </p>
        ) : (
          <PaymentDatePicker
            orderId={details.orderId!}
            paymentDate={
              details.paymentDate ? new Date(details.paymentDate) : undefined
            }
          />
        )}
      </div>
    </section>
  );
}
