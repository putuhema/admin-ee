import { create } from "zustand";

interface Drawer {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const initialState: Omit<Drawer, "onOpen" | "onClose"> = {
  isOpen: false,
};

export const useOpenDrawer = create<Drawer>((set) => ({
  ...initialState,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useOpenDrawer;
