import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { useGetPrograms } from "@/features/programs/hooks/get";
import { EnrollmentData } from "@/features/enrollment/schema";
interface ProgramFeildsProps {
  form: UseFormReturn<EnrollmentData>;
}

export default function ProgramFields({ form }: ProgramFeildsProps) {
  const { data: programs } = useGetPrograms();
  return (
    <FormField
      control={form.control}
      name="programId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Program
            <span className="text-destructive ml-1" aria-hidden="true">
              *
            </span>
          </FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a programs" />
              </SelectTrigger>
            </FormControl>
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
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
