import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function TeacherAvatar() {
  return (
    <Avatar className="w-8 h-8">
      <AvatarImage src="#" />
      <AvatarFallback className="text-sm">TC</AvatarFallback>
    </Avatar>
  );
}
