"use client";
import React from "react";

import { Button } from "@/components/ui/button";
import { BookPlus } from "lucide-react";
import useOpenDrawer from "../hooks/user-open-drawer";

export default function DrawerButton() {
  const { onOpen } = useOpenDrawer();
  return (
    <div className="absolute z-50 left-0 -top-20 p-4">
      <Button onClick={onOpen} className="rounded-full h-12 w-12">
        <BookPlus />
      </Button>
    </div>
  );
}
