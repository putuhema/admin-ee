import React from "react";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import BookPreparationsForm from "./form/book-preparations-form";
import useOpenDrawer from "../hooks/user-open-drawer";

export default function BookPrepDrawer() {
  const { isOpen, onClose } = useOpenDrawer();
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Siapkan Buku</DrawerTitle>
          <DrawerDescription>
            Silakan isi formulir berikut untuk memulai persiapan buku baru
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 pb-10">
          <BookPreparationsForm drawer={true} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
