import { BookPreparationData } from "@/features/book-preparations/queries/get-book-preparations";

export type BookPrep = BookPreparationData["bookPreps"][0];

export interface BookPrepFilter {
  search?: string;
  program?: string;
  status?: string;
  sort?: string;
  order?: string;
}
