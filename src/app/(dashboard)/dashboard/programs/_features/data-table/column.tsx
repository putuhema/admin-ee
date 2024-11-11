"use client";

import { ColumnDef } from "@tanstack/react-table";

import { type ResponseType } from "../hooks/get";

export const columns: ColumnDef<ResponseType[number]>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "price_per_meeting",
    header: "Price Per-Meeting",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
];
