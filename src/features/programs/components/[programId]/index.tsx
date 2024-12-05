"use client";

import React from "react";

import MeetingTracker from "./meeting-tracker";
import MonthYearPicker from "./month-year-picker";
import MeetingProgramSkeleton from "./meeting-program-skeleton";
import { useGetEnrollmentProgram } from "@/features/enrollment/queries/get-enrollment-by-program";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useParams } from "next/navigation";

export default function MeetingProgramPage() {
  const { programId } = useParams();

  const [monthYear, setMonthYear] = React.useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const { data: programs, isLoading } = useGetEnrollmentProgram(
    Number(programId),
  );

  const handleMonthYearChange = (month?: number, year?: number) => {
    setMonthYear({
      ...monthYear,
      month: month ?? monthYear.month,
      year: year ?? monthYear.year,
    });
  };

  if (isLoading) {
    return <MeetingProgramSkeleton />;
  }

  if (!programs) {
    return (
      <div className="text-center text-muted-foreground">Program not found</div>
    );
  }

  return (
    <section className="space-y-4">
      <div className="inline-flex justify-between items-center w-full">
        <h1 className="uppercase">{programs[0].program!.name}</h1>
        <MonthYearPicker handleMonthYearChange={handleMonthYearChange} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">#</TableHead>
            <TableHead>Nama Murid</TableHead>
            <TableHead>Kehadiran</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {programs.map((p, idx) => (
            <TableRow key={p.enrollment.id}>
              <TableCell className="font-medium">{idx + 1}</TableCell>
              <TableCell>{p.student?.name}</TableCell>
              <TableCell>
                <MeetingTracker
                  monthYear={monthYear}
                  programId={p.program?.id}
                  studentId={p.student?.id}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
