import { create } from "zustand";

interface Sheet {
  id: string;
  isOpen: boolean;
}

interface SheetStore {
  sheets: Record<string, Sheet>;
  openSheet: (id: string) => void;
  closeSheet: (id: string) => void;
  toggleSheet: (id: string, value: boolean) => void;
  getSheet: (id: string) => Sheet | undefined;
}

export const useSheetStore = create<SheetStore>((set, get) => ({
  sheets: {},
  openSheet: (id: string) =>
    set((state) => ({
      sheets: {
        ...state.sheets,
        [id]: { id, isOpen: true },
      },
    })),
  closeSheet: (id: string) =>
    set((state) => ({
      sheets: {
        ...state.sheets,
        [id]: { ...state.sheets[id], isOpen: false },
      },
    })),
  toggleSheet: (id: string, value: boolean) => {
    set((state) => ({
      sheets: {
        ...state.sheets,
        [id]: {
          id,
          isOpen: value,
        },
      },
    }));
  },
  getSheet: (id: string) => get().sheets[id],
}));

interface ID {
  id: string;
  value: number;
}

interface IDstore {
  id: Record<string, ID>;
  setId: (id: number) => void;
  getId: () => ID | undefined;
}

export const useIDStore = create<IDstore>((set, get) => ({
  id: {},
  setId: (id: number) =>
    set((state) => ({
      id: {
        ...state.id,
        [id]: { id, value: id },
      },
    })),
  getId: () => get().id[Object.keys(get().id)[0]],
}));
