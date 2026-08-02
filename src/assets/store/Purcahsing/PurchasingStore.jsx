import { create } from "zustand";

const usePurchasingStore = create((set) => ({
  selectedPurDetailsItem: null,
  detailsItemEdit: null,
  selectedActualList: null,
  suppliersConfirmation: false,
  intialView: false,
  underPayingView: false,
  purchasingList: [],
  purchasingHistoryOrder: false,
  openBrandPopup: false,
  selectedPurItem: null,
  subCodingPopUpOpen: false,
  unitEditPopUp: false,
  itemEditPopUp: false,
  groupEditPopUp: false,
  subGroupEditPopUp: false,
  packagingEditPopUp: false,
  selectedRecipeFoodItem: false,
  selectedRecipeManufactureItem: false,

  setSelectedPurItem: (value) => {
    set({ selectedPurItem: value });
  },
  setSelectedPurDetailsItem: (value) => {
    set({ selectedPurDetailsItem: value });
  },
  setDetailsItemEdit: (value) => {
    set({ detailsItemEdit: value });
  },
  setSelectedActualList: (value) => {
    set({ selectedActualList: value });
  },
  setSuppliersConfirmation: (value) => {
    set({ suppliersConfirmation: value });
  },
  setIntialView: (value) => {
    set({ intialView: value });
  },
  setUnderPayingView(value) {
    set({ underPayingView: value });
  },
  setPurchasingList(value) {
    set({ purchasingList: value });
  },

  setPurchasingHistoryOrder(value) {
    set({ purchasingHistoryOrder: value });
  },

  setOpenBrandPopup(value) {
    set({ openBrandPopup: value });
  },
  setSubCodingPopUpOpen: (value) => {
    set({ subCodingPopUpOpen: value });
  },
  setUnitEditPopUp: (value) => {
    set({ unitEditPopUp: value });
  },
  setItemEditPopUp: (value) => {
    set({ itemEditPopUp: value });
  },
  setGroupEditPopUp: (value) => {
    set({ groupEditPopUp: value });
  },
  setSubGroupEditPopUp: (value) => {
    set({ subGroupEditPopUp: value });
  },
  setPackagingEditPopUp: (value) => {
    set({ packagingEditPopUp: value });
  },
  setSelectedRecipeFoodItem: (value) => {
    set({ selectedRecipeFoodItem: value });
  },
  setSelectedRecipeManufactureItem: (value) => {
    set({ selectedRecipeManufactureItem: value });
  },
}));

export default usePurchasingStore;
