"use client";
import { DataTable } from "@/features/programs/components/data-table";
import { useGetPrograms } from "../hooks/get";
import { columns } from "./column";

export default function Table() {
  const { data, isLoading } = useGetPrograms();

  if (isLoading) {
    return <div className="w-full text-center animate-pulse">Loading...</div>;
  }

  if (!data) {
    return <div className="w-full text-center">No data found</div>;
  }

  return <DataTable columns={columns} data={data} />;
}
