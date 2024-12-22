import { create } from "zustand";

interface NewBookPreparations {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const initialState: Omit<NewBookPreparations, "onOpen" | "onClose"> = {
  isOpen: false,
};

export const usenewBookPreparations = create<NewBookPreparations>((set) => ({
  ...initialState,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default usenewBookPreparations;
