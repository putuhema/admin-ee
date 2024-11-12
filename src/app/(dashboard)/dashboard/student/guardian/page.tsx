import React from "react";
import GuardianForm from "./form";
import BackButton from "@/components/back-button";

export default async function StudentGuardianPage() {
  return (
    <main className="w-full">
      <BackButton />
      <div className="max-w-lg mx-auto">
        <h1 className="text-xl text-center">Guardian Form</h1>
        <GuardianForm />
      </div>
    </main>
  );
}
