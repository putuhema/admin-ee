"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Table from "@/features/enrollment/data-table/table";
import useNewEnrollment from "./hooks/use-new-enrollment";

export default function EnrollmentList() {
  const { onOpen } = useNewEnrollment();

  const handleOpenSheet = () => {
    onOpen();
  };

  return (
    <main className="space-y-2 w-full">
      <Button onClick={handleOpenSheet} variant="outline">
        Pendaftaran Baru
      </Button>
      <Table />
    </main>
  );
}
