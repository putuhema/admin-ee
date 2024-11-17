"use client";
import { DataTable } from "@/components/data-table";
import { columns } from "./column";
import { useGetMeetings } from "../api/get-meetings";

export default function Table() {
  const { data } = useGetMeetings();

  if (!data) {
    return <div className="w-full text-center animate-pulse">Loading...</div>;
  }

  return <DataTable columns={columns} data={data} />;
}
