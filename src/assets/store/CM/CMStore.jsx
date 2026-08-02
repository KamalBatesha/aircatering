import { create } from "zustand";

const useCMStore = create((set) => ({
  selectedPurchasingOrder: null,
  selectedFoodItem: null,
  selectedManufacturedItem: null,
  newOrderPopUp: false,
  newEMOrderPopUp: false,
  selectedKitchenRequest: null,
  selectedPreparationRequest: null,
  purchasingOrders: [],
  tasteOrders: [],
  CMPurchasingHistoryView: false,
  CMTasteView: false,
  choosePosPopup: false,
  itemTypePos: null,
  purActionType: null,
  selectedTasteOrder: false,
  selectedTasteDetailsOrder: false,
  minAndMaxPopUp: false,
  alarmRecipePopup: false,

  setSelectedPurchasingOrder: (value) => {
    set({ selectedPurchasingOrder: value });
  },
  setSelectedFoodItem: (value) => {
    set({ selectedFoodItem: value });
  },
  setSelectedManufacturedItem: (value) => {
    set({ selectedManufacturedItem: value });
  },
  setNewOrderPopUp: (value) => {
    set({ newOrderPopUp: value });
  },
  setSelectedKitchenRequest: (value) => {
    set({ selectedKitchenRequest: value });
  },
  setSelectedPreparationRequest: (value) => {
    set({ selectedPreparationRequest: value });
  },
  setNewEMOrderPopUp: (value) => {
    set({ newEMOrderPopUp: value });
  },
  setMinAndMaxPopUp: (value) => {
    set({ minAndMaxPopUp: value });
  },
  setPurchasingOrders: (value) => set({ purchasingOrders: value }),
  setTasteOrders: (value) => set({ purchasingOrders: value }),
  setCMPurchasingHistoryView: (value) =>
    set({ CMPurchasingHistoryView: value }),
  setChoosePosPopup: (value) => set({ choosePosPopup: value }),
  setItemTypePos: (value) => set({ itemTypePos: value }),
  setPurActionType: (value) => set({ purActionType: value }),
  setSelectedTasteOrder: (value) => set({ selectedTasteOrder: value }),
  setSelectedTasteDetailsOrder: (value) => set({ selectedTasteDetailsOrder: value }),
  setCMTasteView: (value) => set({ CMTasteView: value }),
  setAlarmRecipePopup: (value) => set({ alarmRecipePopup: value }),
}));

export default useCMStore;
