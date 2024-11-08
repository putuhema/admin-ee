import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PaymentForm } from "@/lib/zod-schema";

type Props = {
  formData: PaymentForm;
};

export default function PaymentFormDialog({ formData }: Props) {
  return (
    <div>
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail Pembayaran</DialogTitle>
            <DialogDescription>
              Detail pembayaran untuk siswa {formData.studentId}
            </DialogDescription>
            <div className="w-full p-4 grid grid-cols-2 gap-2">
              <p>Nama Siswa</p>
              <p>: {formData.studentId}</p>
              <p>Subjek</p>
              <p>: {formData.subject}</p>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
