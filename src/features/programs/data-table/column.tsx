"use client";

import { ColumnDef } from "@tanstack/react-table";
import { type ResponseType } from "../hooks/get";
import DropdownAction from "../components/dropdown-action";
import { formatCurrency } from "@/lib/utils";

export const columns: ColumnDef<ResponseType[number]>[] = [
  {
    id: "index",
    header: "#",
    cell: ({ row }) => {
      return <span>{row.index + 1}</span>;
    },
  },
  {
    id: "name",
    accessorKey: "name",
    header: "Nama Program",
    cell: ({ row }) => {
      return <span className="capitalize">{row.getValue("name")}</span>;
    },
  },
  {
    accessorKey: "book",
    header: "Buku",
    cell: ({ row }) => {
      const book = row.original.extra.find((e) => e.type === "book")?.price;
      return <span className="capitalize">{formatCurrency(book ?? 0)}</span>;
    },
  },
  {
    accessorKey: "certificate",
    header: "sertifikat",
    cell: ({ row }) => {
      const certificate = row.original.extra.find(
        (e) => e.type === "certificate",
      )?.price;
      return (
        <span className="capitalize">{formatCurrency(certificate ?? 0)}</span>
      );
    },
  },
  {
    accessorKey: "thropy",
    header: "Trofi",
    cell: ({ row }) => {
      const thropy = row.original.extra.find((e) => e.type === "thropy")?.price;
      return <span className="capitalize">{formatCurrency(thropy ?? 0)}</span>;
    },
  },
  {
    accessorKey: "medal",
    header: "Medali",
    cell: ({ row }) => {
      const medal = row.original.extra.find((e) => e.type === "medal")?.price;
      return <span className="capitalize">{formatCurrency(medal ?? 0)}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const programId = row.original.id!;
      return <DropdownAction programId={programId} />;
    },
  },
];
