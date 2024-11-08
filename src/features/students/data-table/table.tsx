"use client";
import { DataTable } from "@/components/data-table";
import { columns } from "@/features/students/data-table/column";
import { useGetSubjects } from "../hooks/use-get-students";

export default function Table() {
  const { data: students } = useGetSubjects();

  if (!students) {
    return null;
  }

  return <DataTable columns={columns} data={students} />;
}
