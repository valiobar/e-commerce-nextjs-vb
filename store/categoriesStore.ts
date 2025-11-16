import { create } from "zustand";

interface CategoriesStore {
  isOpen: boolean;
  openCategories: () => void;
  closeCategories: () => void;
  toggleCategories: () => void;
}

export const useCategoriesStore = create<CategoriesStore>((set) => ({
  isOpen: false,
  openCategories: () => set({ isOpen: true }),
  closeCategories: () => set({ isOpen: false }),
  toggleCategories: () => set((state) => ({ isOpen: !state.isOpen })),
}));

