"use client";

import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { useClickAway } from "@uidotdev/usehooks";
import { Edit } from "lucide-react";
import { useUpdateBookPreparation } from "../queries/put-bookprep";

interface BookPrepTextareaProps {
  prevNotes: string;
  id: number;
  studentId: number;
  programId: number;
}

export default function BookPrepTextarea({
  prevNotes,
  id,
  studentId,
  programId,
}: BookPrepTextareaProps) {
  const [open, setOpen] = React.useState(false);
  const { mutate } = useUpdateBookPreparation();
  const [notes, setNotes] = React.useState(prevNotes ?? "");

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };
  const submit = () => {
    if (open) {
      mutate({ notes, id, studentId: studentId.toString(), programId });
    }
    setOpen(false);
  };

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit();
  };

  const ref = useClickAway<HTMLTextAreaElement>(() => {
    submit();
  });

  return open ? (
    <form onSubmit={handleOnSubmit}>
      <Textarea
        ref={ref}
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value);
        }}
      />
    </form>
  ) : (
    <div className="inline-flex items-center gap-2">
      {notes}
      <button onClick={handleToggle} className="text-left">
        <Edit className="w-4 h-4 text-muted-foreground" />
      </button>
    </div>
  );
}
