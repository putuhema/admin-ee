"use client";
import { DataTable } from "@/components/data-table";
import { columns } from "@/features/students/data-table/column";
import { useGetStudents } from "../hooks/use-get-students";

export default function Table() {
  const { data: students } = useGetStudents();

  if (!students) {
    return null;
  }

  return <DataTable columns={columns} data={students} />;
}
