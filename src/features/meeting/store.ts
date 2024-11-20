import { create } from "zustand";

interface MeetingIDStore {
  meetingID: number;
  setMeetingID: (id: number) => void;
  getMeetingID: () => number;
}

export const useMeetingIDStore = create<MeetingIDStore>((set, get) => ({
  meetingID: 0,
  setMeetingID: (id: number) =>
    set(() => ({
      meetingID: id,
    })),
  getMeetingID: () => get().meetingID,
}));

interface MeetingForm {
  meetingId: number;
  checkInTime: Date;
  checkOutTime: Date;
  teacherId: string;
}

interface MeetingDialog {
  meeting: MeetingForm;
  open: boolean;
  setOpen: (open: boolean) => void;
  setMeeting: (meeting: MeetingForm) => void;
}

export const useMeetingDialogStore = create<MeetingDialog>((set) => ({
  meeting: {
    meetingId: 0,
    teacherId: "",
    checkInTime: new Date(),
    checkOutTime: new Date(),
  },
  open: false,
  setOpen: (open: boolean) =>
    set(() => ({
      open,
    })),
  setMeeting: (meeting: MeetingForm) =>
    set(() => ({
      meeting,
    })),
}));
