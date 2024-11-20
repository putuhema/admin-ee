import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

const $get = client.api.students.enrollment[":studentId"]["$get"];

export async function getStudentEnrollment(studentId: number) {
  const res = await $get({ param: { studentId: studentId.toString() } });
  if (!res.ok) {
    throw new Error("Error fetching student enrollment");
  }
  return await res.json();
}

export function useGetStudentEnrollment(studentId: number) {
  const query = useQuery({
    queryKey: ["student-enrollment", studentId],
    queryFn: () => getStudentEnrollment(studentId),
    enabled: !!studentId && !isNaN(studentId),
  });

  return query;
}
