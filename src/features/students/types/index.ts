import { studentSchema } from "@/db/schema";
import { z } from "zod";

export interface StudentFilters {
  search?: string;
  sort?: string;
  order?: string;
}

export type Student = z.infer<typeof studentSchema> & {
  optimisticStatus?: "creating" | "updating" | "deleting";
};
