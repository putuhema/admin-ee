import { create } from "zustand";

interface EditState {
  isOpen: boolean;
  id: number;
  onOpen: (studentId: number) => void;
  onClose: () => void;
}

const initialState: Omit<EditState, "onOpen" | "onClose"> = {
  isOpen: false,
  id: 0,
};

export const useEditBookPreps = create<EditState>((set) => ({
  ...initialState,
  onOpen: (id) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false }),
}));

export default useEditBookPreps;
