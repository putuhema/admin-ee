"use client";
import { DataTable } from "@/components/data-table";
import { columns } from "./meeting-column";
import { useGetMeetingByDate } from "@/features/meeting/queries/get-meeting-by-date";
import { useParams } from "next/navigation";

export default function Table() {
  const { date } = useParams();
  const { data } = useGetMeetingByDate(new Date(date!.toString()));

  if (!data) {
    return <div className="w-full text-center animate-pulse">Loading...</div>;
  }

  return <DataTable columns={columns} data={data} name="studentName" />;
}
