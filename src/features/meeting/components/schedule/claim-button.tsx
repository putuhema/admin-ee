"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useClaimSession } from "@/features/meeting/queries/claim-session";
import { MeetingDateData } from "../../queries/get-meeting-by-date";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { PC, PROGRAM_COLOR } from "./home-schedule";

interface ClaimButtonProps {
  meetings: MeetingDateData[0]["programGroups"][0]["details"];
}

export default function ClaimButton({ meetings }: ClaimButtonProps) {
  const [open, setOpen] = React.useState(false);
  const [session, setSession] = React.useState(meetings.length ?? 1);
  const { mutate } = useClaimSession();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate({
      session,
      ids: meetings.map((m) => m.id),
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            PROGRAM_COLOR[meetings[0].programName as PC].box,
            "bg-transparent hover:bg-transparent",
            `hover:${PROGRAM_COLOR[meetings[0].programName as PC].text}`,
          )}
        >
          Mulai Mengajar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Mulai Mengajar {meetings[0].studentNickname} ?
          </DialogTitle>
          <DialogDescription>
            Pilih panjang Sesi mengajar untuk program{" "}
            <span className="capitalize">{meetings[0].programName}</span>.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 items-center gap-y-4"
        >
          <div className="capitalize">{meetings[0].programName}</div>
          <Select
            value={session.toString()}
            defaultValue={session.toString()}
            onValueChange={(val) => setSession(Number(val))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sesi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Jam/Sesi</SelectItem>
              <SelectItem value="2">2 Jam/Sesi</SelectItem>
              <SelectItem value="3">3 Jam/Sesi</SelectItem>
              <SelectItem value="4">4 Jam/Sesi</SelectItem>
            </SelectContent>
          </Select>
          <Button className="col-span-full">Mulai Mengajar</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
