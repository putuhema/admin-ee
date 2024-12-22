import * as React from "react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Minus, Search, X } from "lucide-react";
import { type UseFormReturn, type FieldValues, Path } from "react-hook-form";

import { useGetStudentsWithQuery } from "@/features/students/queries/use-get-student-query";
import { useClickAway, useDebounce } from "@uidotdev/usehooks";

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
};

export default function NameSearchInput<T extends FieldValues>({
  form,
  name,
}: Props<T>) {
  const [searchTerm, setSearchTerm] = React.useState(
    form.getValues(name) ?? ""
  );
  const [isOpen, setIsOpen] = React.useState(true);
  const debounceName = useDebounce(searchTerm, 500);
  const { data: students, isLoading } = useGetStudentsWithQuery(debounceName);

  const ref = useClickAway<HTMLDivElement>(() => {
    form.resetField(name);
  });

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nama Murid</FormLabel>
          <FormControl>
            <div>
              <div className="relative">
                <Search className="absolute w-5 h-5 left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                {(searchTerm || form.getValues(name)) && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setIsOpen(false);
                      form.resetField(name);
                    }}
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <Input
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsOpen(true);
                  }}
                  type="search"
                  placeholder="Cari nama murid ..."
                  className="pl-10 pr-4 py-2"
                  aria-label="Search names"
                />
                {isOpen && searchTerm && (
                  <div
                    ref={ref}
                    className="absolute mt-1 w-full bg-white border rounded-md shadow-lg z-10"
                  >
                    <ScrollArea className="max-h-[300px]">
                      {isLoading ? (
                        <p className="animate-pulse text-muted-foreground inline-flex gap-2 items-center justify-center w-full text-center p-3">
                          <Loader2 className="animate-spin w-4 h-4 mr-2" />
                          Loading ...
                        </p>
                      ) : (
                        <>
                          {students && students.length > 0 ? (
                            <ul className="py-2 px-3">
                              {students.map((student) => (
                                <li
                                  key={student.id}
                                  className="px-2 py-1 inline-flex items-center gap-2 w-full hover:bg-gray-100 rounded cursor-pointer"
                                  onClick={() => {
                                    field.onChange(student.id.toString());
                                    setSearchTerm(student.name!);
                                    setIsOpen(false);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                      field.onChange(student.id.toString());
                                      setSearchTerm(student.name!);
                                      setIsOpen(false);
                                    }
                                  }}
                                  tabIndex={0}
                                  role="option"
                                  aria-selected={searchTerm === student.name}
                                >
                                  {student.name}{" "}
                                  <Minus className="w-4 h-4 text-muted-foreground" />
                                  <span className="tracking-wide font-semibold text-muted-foreground italic">
                                    {student.nickname}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="p-3 text-sm text-muted-foreground text-center">
                              No names found
                            </p>
                          )}
                        </>
                      )}
                    </ScrollArea>
                  </div>
                )}
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
