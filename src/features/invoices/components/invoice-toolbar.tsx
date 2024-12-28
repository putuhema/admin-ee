import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import React from "react";

export default function InvoiceToolbar() {
  const [search, setSearch] = React.useState("");
  return (
    <div>
      <div className="relative w-full">
        <Search className="absolute w-6 text-muted-foreground  h-6 left-2 top-1/2 transform -translate-y-1/2" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 placeholder:text-sm"
          placeholder="Cari siswa"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute  text-muted-foreground right-2 top-1/2 transform -translate-y-1/2"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
