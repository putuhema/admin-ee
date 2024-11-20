import React from "react";

import CustomSheet from "@/components/custom-sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { StudentForm } from "./student-form/student-form";
import { StudentGuardianForm } from "./student-guardian-form";

export default function StudentFormSheet() {
  return (
    <CustomSheet SHEET_ID="STUDENT_FORM" title="Student and Guardian Form">
      <Tabs defaultValue="student">
        <TabsList className="w-full justify-start mt-8">
          <TabsTrigger value="student">Student Form</TabsTrigger>
          <TabsTrigger value="guardian">Guardian Form</TabsTrigger>
        </TabsList>
        <TabsContent value="student">
          <StudentForm />
        </TabsContent>
        <TabsContent value="guardian">
          <StudentGuardianForm />
        </TabsContent>
      </Tabs>
    </CustomSheet>
  );
}
