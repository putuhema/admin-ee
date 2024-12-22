"use client";
import React from "react";
import { useGetPrograms } from "@/features/programs/hooks/get";

const BookPreparationPage = () => {
  const { data: programs, isLoading } = useGetPrograms();

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (!programs) {
    return <div>no data</div>;
  }

  return (
    <div>
      <h1>Book Preparation</h1>
      {programs.map((program) => (
        <div key={program.id} className="p-2">
          {program.name}
        </div>
      ))}
    </div>
  );
};

export default BookPreparationPage;
