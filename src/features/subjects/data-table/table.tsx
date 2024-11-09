"use client";
import { DataTable } from "@/components/data-table";
import { columns } from "@/features/subjects/data-table/column";
import { useGetSubjectPricing } from "../hooks/use-get-pricing";

export default function Table() {
  const { data: subjects } = useGetSubjectPricing();

  if (!subjects) {
    return null;
  }

  return <DataTable columns={columns} data={subjects} />;
}
