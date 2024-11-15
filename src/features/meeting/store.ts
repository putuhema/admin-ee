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
