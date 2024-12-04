import React from "react";
import { Button } from "@/components/ui/button";
import { useClaimSession } from "@/features/meeting/queries/claim-session";

interface ClaimButtonProps {
  currentId: number | null;
  meetingId: number;
  handleCurrentId: (id: number) => void;
}

export default function ClaimButton({
  currentId,
  meetingId,
  handleCurrentId,
}: ClaimButtonProps) {
  const { mutate, isPending } = useClaimSession();
  const handleClaimSession = () => {
    handleCurrentId(meetingId);
    mutate({ meetingId });
  };
  return (
    <Button
      isLoading={isPending && currentId === meetingId}
      variant="outline"
      onClick={handleClaimSession}
    >
      Mulai Mengajar
    </Button>
  );
}
