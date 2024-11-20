import { create } from "zustand";

interface EditStudentState {
  isOpen: boolean;
  studentId: number;
  onOpen: (studentId: number) => void;
  onClose: () => void;
}

const initialState: Omit<EditStudentState, "onOpen" | "onClose"> = {
  isOpen: false,
  studentId: 0,
};

export const useEditStudent = create<EditStudentState>((set) => ({
  ...initialState,
  onOpen: (studentId) => set({ isOpen: true, studentId }),
  onClose: () => set({ isOpen: false }),
}));

export default useEditStudent;
