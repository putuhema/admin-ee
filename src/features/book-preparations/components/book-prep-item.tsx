"use client";
import React from "react";

import { useGetBookPreps } from "../queries/get-book-preparations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import StatusColumnHeader from "./table/status-column-header";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteBookPreparation } from "../queries/delete-bookprep";
import { formatCurrency } from "@/lib/utils";
import { BookPrepDatePicker } from "./book-prep-date-picker";
import BookPrepTextarea from "./book-prep-textarea";
import { Trash } from "lucide-react";
import { useBookPrepFiltersStore } from "../hooks/useFilterBookPrep";
import { useDebounce } from "@uidotdev/usehooks";

export default function BookPrepItem() {
  const [ConfirmationDialog, confirm] = useConfirm({
    title: "Hapus Persiapan Buku",
    message: "Apakah kamu yakin untuk menghapus persiapan buku ini?",
  });
  const { appliedFilters } = useBookPrepFiltersStore();
  const debounceFilter = useDebounce(appliedFilters, 500);
  const { data, isLoading } = useGetBookPreps(10, 0, { ...debounceFilter });
  const { mutate: deleteBookPrep } = useDeleteBookPreparation();

  const handleDeleteBookPrep = async (id: number) => {
    const confirmed = await confirm();
    if (confirmed) {
      deleteBookPrep({
        id,
      });
    }
  };

  if (isLoading) {
    return <div>is loading</div>;
  }

  if (!data) {
    return <div>no data</div>;
  }
  return (
    <div className="space-y-2">
      {data.bookPreps.map((bookPrep) => (
        <div key={bookPrep.id}>
          <h3 className="font-bold">{bookPrep.student?.name}</h3>
          <div className="flex items-center justify-between">
            <Drawer>
              <DrawerTrigger className="capitalize text-muted-foreground">
                {bookPrep.program?.name}
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader className="border-b border-dashed">
                  <DrawerTitle className="uppercase">
                    {bookPrep.student?.name}
                  </DrawerTitle>
                  <DrawerDescription>
                    Persiapan buku untuk program{" "}
                    <span className="capitalize">{bookPrep.program?.name}</span>
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4 space-y-2">
                  <div className="grid grid-cols-2">
                    <p>Status</p>
                    <StatusColumnHeader
                      id={bookPrep.id}
                      currentStatus={bookPrep.status}
                      className="capitalize rounded-lg"
                      showIcon={false}
                    />
                  </div>

                  <div className="grid grid-cols-2">
                    <p>Harga</p>
                    <p>{formatCurrency(bookPrep.price)}</p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p>Catatan</p>
                    <BookPrepTextarea
                      id={bookPrep.id}
                      studentId={bookPrep.student!.id}
                      programId={bookPrep.program!.id}
                      prevNotes={bookPrep.notes}
                    />
                  </div>
                  <h3 className="font-bold">Tanggal - tanggal :</h3>
                  <div className="border p-2 rounded-md border-dashed space-y-2 text-sm">
                    <div className="grid grid-cols-2">
                      <p>Persiapan</p>
                      {bookPrep.prepareDate ? (
                        <BookPrepDatePicker
                          id={bookPrep.id}
                          type="prepare"
                          date={new Date(bookPrep.prepareDate)}
                        />
                      ) : (
                        "-"
                      )}
                    </div>
                    <div className="grid grid-cols-2">
                      <p>Dibayar</p>
                      {bookPrep.paidDate ? (
                        <BookPrepDatePicker
                          id={bookPrep.id}
                          type="paid"
                          date={new Date(bookPrep.paidDate)}
                        />
                      ) : (
                        "-"
                      )}
                    </div>
                    <div className="grid grid-cols-2">
                      <p>Diterima</p>
                      {bookPrep.deliveredDate ? (
                        <BookPrepDatePicker
                          id={bookPrep.id}
                          type="delivered"
                          date={new Date(bookPrep.deliveredDate)}
                        />
                      ) : (
                        "-"
                      )}
                    </div>
                  </div>
                </div>
                <DrawerFooter>
                  <Button
                    onClick={() => handleDeleteBookPrep(bookPrep.id)}
                    variant="destructive"
                  >
                    <Trash />
                    Hapus
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
            <Badge className="pl-4 capitalize ">{bookPrep.status}</Badge>
          </div>
        </div>
      ))}

      <ConfirmationDialog />
    </div>
  );
}
