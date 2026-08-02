import { create } from "zustand";

const useKDStore = create((set) => ({
  selectedTransferRequest: null,
  selectedPurchasingRequest: null,
  purListFilter: "S",
  transferRequests: [],
  purchasingRequests: [],
  openNotePopup: false,
  noteItems: false,
  holdPopUp: false,
  donePopUp: false,
  doneFlightPopUp: false,
  isReadOnly: false,
  individualOrdersLength:0,
  thisDone: false,
  imgPath: null,
  selectedItemInTicket: false,

  setIndividualOrdersLength:(value)=>set({individualOrdersLength:value}),

  setSelectedTransferRequest: (value) => set({ selectedTransferRequest: value }),
  setSelectedPurchasingRequest: (value) => set({ selectedPurchasingRequest: value }),
  setPurListFilter: (value) => set({ purListFilter: value }),
  removeSelectedItem: () => set({ selectedTransferRequest: null, selectedPurchasingRequest: null }),
  setTransferRequests: (value) => set({ transferRequests: value }),
  setPurchasingRequests: (value) => set({ purchasingRequests: value }),
  setOpenNotePopup: (value) => set({ openNotePopup: value }),
  setNoteItems: (value) => set({ noteItems: value }),
  setHoldPopUp: (value) => set({ holdPopUp: value }),
  setDonePopUp: (value) => set({ donePopUp: value }),
  setDoneFlightPopUp: (value) => set({ doneFlightPopUp: value }),
  setIsReadOnly: (value) => set({ isReadOnly: value }),
  setThisDone: (value) => set({ thisDone: value }),
  setImgPath: (value) => set({ imgPath: value }),
  setSelectedItemInTicket: (value) => set({ selectedItemInTicket: value }),
}));

export default useKDStore;
