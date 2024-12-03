import { create } from "zustand";

interface DetailsEnrollmentState {
  isOpen: boolean;
  enrollmentId: number;
  onOpen: (studentId: number) => void;
  onClose: () => void;
}

const initialState: Omit<DetailsEnrollmentState, "onOpen" | "onClose"> = {
  isOpen: false,
  enrollmentId: 0,
};

export const useDetailsEnrollment = create<DetailsEnrollmentState>((set) => ({
  ...initialState,
  onOpen: (enrollmentId) => set({ isOpen: true, enrollmentId }),
  onClose: () => set({ isOpen: false }),
}));

export default useDetailsEnrollment;
