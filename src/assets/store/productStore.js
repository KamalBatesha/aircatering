import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useProductStore = create(
  persist((set, get) => ({
    product: [],
    setProduct: (product) => set({ product }),
    isArrival: true,
    isDeparture: false,
    setIsArrivalAndDeparture: (isArrival, isDeparture) =>
      set({ isArrival, isDeparture }),
  })),
);
