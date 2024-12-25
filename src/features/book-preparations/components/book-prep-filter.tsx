"use client";

import React from "react";

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useBookPrepFiltersStore } from "../hooks/useFilterBookPrep";
import { useGetPrograms } from "@/features/programs/hooks/get";
import { BookPrepFiltersState } from "../types/filters";

export default function BookPrepFilter() {
  const { data: programs } = useGetPrograms();
  const { setValue, appliedFilters, filter } = useBookPrepFiltersStore();

  const program = programs?.find(
    (program) => program.id === Number(appliedFilters.program)
  );
  const filterArray = Object.entries(filter).filter(([_, value]) => value);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("search", e.target.value);
  };

  const handleClearSearch = () => {
    setValue("search", "");
  };

  return (
    <header className="space-y-2">
      <div className="relative w-full">
        <Search className="absolute w-6 text-muted-foreground  h-6 left-2 top-1/2 transform -translate-y-1/2" />
        <Input
          value={appliedFilters.search}
          onChange={handleInputChange}
          className="w-full pl-10"
          placeholder="Cari siswa"
        />
        {appliedFilters.search && (
          <button
            onClick={handleClearSearch}
            className="absolute  text-muted-foreground right-2 top-1/2 transform -translate-y-1/2"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="w-full flex items-center gap-2">
        <Select
          value={appliedFilters.program}
          onValueChange={(value) => setValue("program", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih program" />
          </SelectTrigger>
          <SelectContent>
            {programs?.map((program) => (
              <SelectItem
                key={program.id}
                value={program.id.toString()}
                className="capitalize"
              >
                {program.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={appliedFilters.status}
          onValueChange={(value) => setValue("status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih Status" />
          </SelectTrigger>
          <SelectContent>
            {["pending", "prepared", "paid", "delivered"].map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center flex-wrap gap-2">
        {filterArray.map(([key, value], index) => (
          <div key={key} className="inline-flex items-center gap-2">
            <span className="text-muted-foreground text-sm">{key}:</span>{" "}
            {key === "program" ? program?.name : value}
            <button
              onClick={() => setValue(key as keyof BookPrepFiltersState, "")}
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
            {filterArray.length - 1 !== index && (
              <span className="text-muted-foreground">,</span>
            )}
          </div>
        ))}
        {filterArray.length > 0 && (
          <button
            className="ml-4 text-red-400 underline hover:text-red-300"
            onClick={() => {
              setValue("search", "");
              setValue("program", "");
              setValue("status", "");
            }}
          >
            Clear All
          </button>
        )}
      </div>
    </header>
  );
}
