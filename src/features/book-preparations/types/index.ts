import { BookPreparationData } from "@/features/book-preparations/queries/get-book-preparations";

export type BookPrep = BookPreparationData["bookPreps"][0];
// & {
//   optimisticStatus?: "creating" | "updating" | "deleting";
// };

export interface BookPrepFilter {
  search?: string;
  sort?: string;
  order?: string;
}
