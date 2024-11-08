import { db } from "@/db";
import { Subject } from "@/db/schema";

export const getSubjects = async () =>
  await db
    .select({
      id: Subject.id,
      name: Subject.name,
    })
    .from(Subject);
