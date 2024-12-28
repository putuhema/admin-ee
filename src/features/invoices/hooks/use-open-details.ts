import { create } from "zustand";

interface Drawer {
  id: number;
  open: boolean;
  onOpen: (id: number) => void;
  onClose: () => void;
}

const initialState: Omit<Drawer, "onOpen" | "onClose"> = {
  id: 0,
  open: false,
};

export const useOpenInvoiceDetailDrawer = create<Drawer>((set) => ({
  ...initialState,
  onOpen: (id: number) => set({ id, open: true }),
  onClose: () => set({ open: false }),
}));

export default useOpenInvoiceDetailDrawer;
