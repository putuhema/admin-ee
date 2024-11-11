import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);
}

export const convertToNumber = (str: string) => {
  const numberString = str.replace(/[^\d]/g, "");
  const toNumber = parseInt(numberString, 10).toString();
  return !isNaN(parseInt(numberString, 10)) ? toNumber : "0";
};

export const formatRupiah = (str: string) => {
  const number = str.replace(/[^\d.]/g, "");
  const [whole, decimal] = number.split(".");
  const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimal ? `${formattedWhole}.${decimal}` : formattedWhole;
};
