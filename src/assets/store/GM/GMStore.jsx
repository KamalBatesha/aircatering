import { create } from "zustand";

const useGMStore = create((set, get) => ({
  selectedCustody: null,
  selectedPurchasingOrder: null,
  salesApproval: false,
  selectedLoan: null,
  loanFinanceView: false,
  purHistoryView: false,
  cancelApprovePopup: false,
  selectedCashTrans: null,
  selectedPur: null,
  selectedMaxItem: null,
  cancelOrDelete: null,
  actionPopUpOpen: null,
  selectedCurrancytransfer: null,
  openReturnChequePopup: false,

  setActionPopUpOpen: (value) => set({ actionPopUpOpen: value }),
  setSelectedCustody: (value) => {
    set({ selectedCustody: value });
  },
  setSelectedPurchasingOrder: (value) => {
    set({ selectedPurchasingOrder: value });
  },
  setSalesApproval: (value) => {
    set({ salesApproval: value });
  },
  setSelectedLoan: (value) => {
    set({ selectedLoan: value });
  },
  setLoanFinanceView: (value) => {
    set({ loanFinanceView: value });
  },
  setPurHistoryView: (value) => {
    set({ purHistoryView: value });
  },
  setCancelApprovePopup: (value) => set({ cancelApprovePopup: value }),
  setSelectedCashTrans: (value) => {
    set({ selectedCashTrans: value });
  },
  setSelectedPur: (value) => {
    set({ selectedPur: value });
  },
  setSelectedMaxItem: (value) => {
    set({ selectedMaxItem: value });
  },
  setCancelOrDelete: (value) => {
    set({ cancelOrDelete: value });
  },
  activateSelection: false,
  setActivateSelection: (value) => set({ activateSelection: value }),
  itemsSelected: [],
  setItemsSelected: (value) =>
    set({
      itemsSelected:
        typeof value === "function" ? value(get().itemsSelected) : value,
    }),
  showBulkApprove: false,
  setShowBulkApprove: (value) => set({ showBulkApprove: value }),
  showBulkSendToApprove: false,
  setShowBulkSendToApprove: (value) => set({ showBulkSendToApprove: value }),
  showBulkRemove: false,
  setShowBulkRemove: (value) => set({ showBulkRemove: value }),
  purchasingOrders: [],
  setPurchasingOrders: (value) => set({ purchasingOrders: value }),
  currentApprovingPageItems: [],
  setCurrentApprovingPageItems: (value) =>
    set((state) => ({
      currentApprovingPageItems:
        typeof value === "function" ? value(state.currentApprovingPageItems) : value,
    })),
  setSelectedCurrancytransfer: (value) =>
    set({ selectedCurrancytransfer: value }),
  isClosedTabActive: false,
  setIsClosedTabActive: (value) => set({ isClosedTabActive: value }),
  isUnderProcedureActive: false,
  setIsUnderProcedureActive: (value) => set({ isUnderProcedureActive: value }),
  isBulkSelectActive: true,
  setIsBulkSelectActive: (value) => set({ isBulkSelectActive: value }),
  selectedCurrency: "All",
  setSelectedCurrency: (value) => set({ selectedCurrency: value }),
  resetSelection: () => set({ activateSelection: false, itemsSelected: [] }),
  setOpenReturnChequePopup: (value) => set({ openReturnChequePopup: value }),
}));

export default useGMStore;
