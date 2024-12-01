import { create } from "zustand";

interface NewEnrollmentState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const initialState: Omit<NewEnrollmentState, "onOpen" | "onClose"> = {
  isOpen: false,
};

export const useNewEnrollment = create<NewEnrollmentState>((set) => ({
  ...initialState,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useNewEnrollment;
