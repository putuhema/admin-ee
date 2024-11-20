import { create } from "zustand";

interface NewStudentState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const initialState: Omit<NewStudentState, "onOpen" | "onClose"> = {
  isOpen: false,
};

export const useNewStudent = create<NewStudentState>((set) => ({
  ...initialState,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useNewStudent;
