"use client";

import * as React from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MeetingDateResponse } from "@/features/meeting/api/get-meeting-by-date";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { AttendaceType, AttendanceSchema } from "@/features/meeting/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useGetTeachers } from "@/features/teachers/api/get-teachers";
import { useCreateMeetingSession } from "@/features/meeting/api/create-meeting-session";

type Props = {
  sessionNumber: number;
  meetings: MeetingDateResponse[0]["programs"][0]["meetings"];
};

export default function SessionButton({ sessionNumber, meetings }: Props) {
  const [open, setOpen] = React.useState(false);
  const { data: teachers, isLoading: teachersIsLoading } = useGetTeachers();

  const mutation = useCreateMeetingSession();
  const form = useForm<AttendaceType>({
    resolver: zodResolver(AttendanceSchema),
    defaultValues: {
      teacherId: "",
      meetingId: [],
      checkInTime: new Date(),
      checkOutTime: new Date(),
      duration: 0,
    },
  });

  const onSubmit = (values: AttendaceType) => {
    const checkInTime = new Date(meetings[0].startTime);
    const checkOutTime = new Date(meetings[meetings.length - 1].endTime);
    const duration = checkOutTime.getTime() - checkInTime.getTime();
    mutation.mutate({
      ...values,
      checkInTime,
      checkOutTime,
      duration: duration / 1000 / 3600,
    });
  };

  React.useEffect(() => {
    if (mutation.isSuccess) {
      form.reset();
      setOpen(false);
    }
  }, [mutation.isSuccess, form]);

  if (teachersIsLoading) {
    return <div>Loading...</div>;
  }

  if (!teachers) {
    return <div>Failed to load teachers</div>;
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        {sessionNumber} {sessionNumber > 1 ? "sessions" : "sesssion"}
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-2">
              {meetings.map((m) => (
                <div key={m.id} className="flex flex-col gap-2 items-start">
                  <div className="flex gap-2">
                    <p>{format(new Date(m.startTime), "hh:mm a")}</p>
                    <span>-</span>
                    <p>{format(new Date(m.endTime), "hh:mm a")}</p>
                  </div>
                  <FormField
                    control={form.control}
                    name="teacherId"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              form.setValue("meetingId", [
                                ...form.getValues("meetingId"),
                                m.id,
                              ]);
                            }}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Teacher" />
                            </SelectTrigger>
                            <SelectContent>
                              {teachers.map((t) => (
                                <SelectItem key={t.id} value={t.id}>
                                  {t.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
            <Button disabled={mutation.isPending} type="submit">
              Save
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
