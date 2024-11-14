"use client";
import { DataTable } from "@/components/data-table";
import { useGetPrograms } from "../hooks/get";
import { columns } from "./column";

export default function Table() {
  const { data } = useGetPrograms();

  if (!data) {
    return <div className="w-full text-center animate-pulse">Loading...</div>;
  }

  return (
    <>
      <DataTable columns={columns} data={data} />;
    </>
  );
}
