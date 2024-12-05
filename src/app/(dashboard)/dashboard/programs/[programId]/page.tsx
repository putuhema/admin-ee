import React from "react";
import MeetingProgramPage from "@/features/programs/components/[programId]";

interface ProgramProps {
  params: {
    programId: string;
  };
}

export default function Program({ params }: ProgramProps) {
  const { programId } = params;
  return <MeetingProgramPage programId={programId} />;
}
