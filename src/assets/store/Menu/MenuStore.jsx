import { create } from "zustand";
const useMainMenuStore = create((set) => ({
  menuItemPopup: false,
  selectedPriceUpdateItem: null,
  selectedPriceUpdateDetailsItem: null,

  setSelectedPriceUpdateItem: (item) => set({ selectedPriceUpdateItem: item }),
  setSelectedPriceUpdateDetailsItem: (item) =>
    set({ selectedPriceUpdateDetailsItem: item }),
  setMenuItemPopup: (value) => set({ menuItemPopup: value }),
}));

export default useMainMenuStore;
