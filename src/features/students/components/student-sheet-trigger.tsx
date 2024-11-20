"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useSheetStore } from "@/lib/store";

export function StudentFormSheetTrigger() {
  const { toggleSheet } = useSheetStore();

  const handleToggleSheet = () => {
    toggleSheet("STUDENT_FORM", true);
  };

  return <Button onClick={handleToggleSheet}>Add Student</Button>;
}
