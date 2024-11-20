import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMeetingDialogStore } from "@/features/meeting/store";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { AttendaceType, AttendanceSchema } from "@/features/meeting/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useGetTeachers } from "@/features/teachers/api/get-teachers";
import { useCreateMeetingSession } from "@/features/meeting/queries/create-meeting-session";

export default function MeetingDialog() {
  const { setOpen, open, meeting } = useMeetingDialogStore();
  const { data: teachers, isLoading: teachersIsLoading } = useGetTeachers();

  const mutation = useCreateMeetingSession();
  const form = useForm<AttendaceType>({
    resolver: zodResolver(AttendanceSchema),
    defaultValues: {
      teacherId: meeting.teacherId ?? "",
      meetingId: 0,
      checkInTime: new Date(),
      checkOutTime: new Date(),
      duration: 0,
    },
  });

  const onSubmit = (values: AttendaceType) => {
    const checkInTime = new Date(meeting.checkInTime);
    const checkOutTime = new Date(meeting.checkOutTime);
    const duration = checkOutTime.getTime() - checkInTime.getTime();
    mutation.mutate({
      ...values,
      meetingId: meeting.meetingId,
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign a Tutor to this session?</DialogTitle>
          <DialogDescription>
            You can assign a tutor to this session by selecting the tutor from
            the list.
          </DialogDescription>
        </DialogHeader>
        <div className="p-4 mt-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="teacherId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        value={field.value}
                        defaultValue={field.value}
                        onValueChange={field.onChange}
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
              <Button disabled={mutation.isPending} type="submit">
                Save
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
