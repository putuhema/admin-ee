import { create } from "zustand";

type IDS = "details" | "form";

interface Drawer {
  details: boolean;
  form: boolean;
  onOpen: (id: IDS) => void;
  onClose: (id: IDS) => void;
}

const initialState: Omit<Drawer, "onOpen" | "onClose"> = {
  details: false,
  form: false,
};

export const useOpenInvoiceDrawer = create<Drawer>((set) => ({
  ...initialState,
  onOpen: (id: IDS) => set({ [id]: true }),
  onClose: (id: IDS) => set({ [id]: false }),
}));

export default useOpenInvoiceDrawer;
