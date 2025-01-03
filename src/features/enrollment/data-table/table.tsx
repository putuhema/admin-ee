import { DataTable } from "@/components/data-table";
import { useGetEnrollement } from "../queries/use-get-enrollment";
import { columns } from "./column";

export default function Table() {
  const { data: enrollments } = useGetEnrollement();

  if (!enrollments) {
    return null;
  }

  return <DataTable columns={columns} data={enrollments} />;
}
