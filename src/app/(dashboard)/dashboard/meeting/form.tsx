"use client";

import * as React from "react";
import { MultiSelectCombobox } from "@/components/multi-combobox";
import { Button } from "@/components/ui/button";
import {
  Form,
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
import { meetingSchema, MeetingType } from "@/features/meeting/schema";
import { useGetPrograms } from "@/features/programs/hooks/get";
import { useGetStudents } from "@/features/students/hooks/use-get-students";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { useForm } from "react-hook-form";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { usePostSchedule } from "@/features/meeting/api/post-meeting";

export default function MeetingForm() {
  const form = useForm<MeetingType>({
    resolver: zodResolver(meetingSchema),
    defaultValues: {
      studentId: [],
      programId: 0,
      startTime: new Date(),
      endTime: new Date(),
      notes: "",
    },
  });

  const [session, setSession] = React.useState("");
  const [date, setDate] = React.useState(new Date());
  const { data: programs, isLoading } = useGetPrograms();
  const { data: studentsData, isLoading: isStudentsLoading } = useGetStudents();

  React.useEffect(() => {
    if (programs) {
      form.setValue("programId", programs[0].id);
    }
  }, [programs, form]);

  const SESSIONS = React.useMemo(() => {
    if (!date) return {};

    const currentDate = new Date(date);
    currentDate.setHours(13, 30, 0, 0);

    return {
      FIRST: {
        startTime: new Date(currentDate),
        endTime: new Date(currentDate.setHours(14, 30)),
      },
      SECOND: {
        startTime: new Date(currentDate.setHours(14, 30)),
        endTime: new Date(currentDate.setHours(15, 30)),
      },
      THIRD: {
        startTime: new Date(currentDate.setHours(15, 30)),
        endTime: new Date(currentDate.setHours(16, 30)),
      },
      FOURTH: {
        startTime: new Date(currentDate.setHours(16, 30)),
        endTime: new Date(currentDate.setHours(17, 30)),
      },
    };
  }, [date]);

  const students = React.useMemo(() => {
    if (!studentsData) return [];
    return studentsData.map((student) => ({
      label: student.name,
      value: student.id.toString(),
    }));
  }, [studentsData]);

  const mutation = usePostSchedule();
  const onSubmit = (data: MeetingType) => {
    mutation.mutate(data);
  };

  React.useEffect(() => {
    if (mutation.isSuccess) {
      form.setValue("studentId", []);
    }
  }, [mutation.isSuccess, form]);

  const handleRenderSelectedItem = (
    values: string[],
    options: { label: string; value: string }[],
    items: number = 3,
  ): string => {
    if (values.length === 0) return "";

    if (values.length <= items) {
      return options
        .reduce<string[]>((accumulator, option) => {
          if (values.includes(option.value)) {
            accumulator.push(option.label);
          }
          return accumulator;
        }, [])
        .join(", ");
    }

    return `${values.length} selected`;
  };

  if (isLoading || isStudentsLoading) return <div>Loading...</div>;
  if (!studentsData) return <div>No students found</div>;
  if (!programs) return <div>No programs found</div>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="programId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Program</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                defaultValue={field.value.toString()}
              >
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="space-y-2">
            <p className="text-sm">Pick A Date</p>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !date && "text-muted-foreground",
                    )}
                  >
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => setDate(date!)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <p className="text-sm">Session</p>
            <Select
              onValueChange={(value) => {
                setSession(value);
                const sessionValue = value as keyof typeof SESSIONS;
                if (SESSIONS[sessionValue] === undefined) return;
                form.setValue("startTime", SESSIONS[sessionValue].startTime);
                form.setValue("endTime", SESSIONS[sessionValue].endTime);
              }}
              defaultValue={session}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Session" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FIRST">First (1st) Session</SelectItem>
                <SelectItem value="SECOND">Second (2nd)Session</SelectItem>
                <SelectItem value="THIRD">First (3rd) Session</SelectItem>
                <SelectItem value="FOURTH">First (4th) Session</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student</FormLabel>
              <MultiSelectCombobox
                label="student"
                options={students}
                value={field.value}
                onChange={field.onChange}
                renderItem={(option) => (
                  <div
                    role="option"
                    aria-selected={field.value.includes(option.value)}
                  >
                    {option.label}
                  </div>
                )}
                renderSelectedItem={() =>
                  handleRenderSelectedItem(field.value, students)
                }
                aria-label="Filter by task type"
                aria-required="false"
                aria-multiselectable="true"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending && (
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
          )}{" "}
          Submit
        </Button>
      </form>
    </Form>
  );
}
