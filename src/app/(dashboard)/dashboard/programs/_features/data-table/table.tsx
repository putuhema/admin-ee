"use client";
import { DataTable } from "@/components/data-table";
import { useGetPrograms } from "../hooks/get";
import { columns } from "./column";

export default function Table() {
  const { data } = useGetPrograms();

  if (!data) {
    return null;
  }

  return <DataTable columns={columns} data={data} />;
}
