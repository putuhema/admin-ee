"use client";

import { DataTable } from "@/components/data-table";
import { columns } from "@/features/enrollment/data-table/column";
import { useGetEnrollement } from "../hooks/use-get-enrollment";

export default function Table() {
  const { data: enrollments } = useGetEnrollement();

  if (!enrollments) {
    return null;
  }

  return <DataTable columns={columns} data={enrollments} />;
}
