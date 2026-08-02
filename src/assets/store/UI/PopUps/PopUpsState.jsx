import { select } from "@syncfusion/ej2-react-schedule";

import { create } from "zustand";

// Create the store
const usePopUpsStore = create((set, get) => ({
  // depPopUpOpen: false,
  // depPopUpReadOnly: true,
  // docPopUpOpen: false,
  // docPopUpReadOnly: true,
  // eduPopUpOpen: false,
  // eduPopUpReadOnly: true,
  // // Actions

  // setDepPopUpOpen: (value) => {
  //   set({ depPopUpOpen: value });
  // },
  // setDepPopUpReadOnly: (value) => {
  //   set({ depPopUpReadOnly: value });
  // },
  // setDocPopUpOpen: (value) => {
  //   set({ docPopUpOpen: value });
  // },
  // setDocPopUpReadOnly: (value) => {
  //   set({ docPopUpReadOnly: value });
  // },
  // setEduPopUpOpen: (value) => {
  //   set({ eduPopUpOpen: value });
  // },
  // setEduPopUpReadOnly: (value) => {
  //   set({ eduPopUpReadOnly: value });
  // },

  addCreditNotePopup: false,
  setAddCreditNotePopup: (value) => {
    set({ addCreditNotePopup: value });
  },

  addCollectionPopup: false,
  setAddCollectionPopup: (value) => {
    set({ addCollectionPopup: value });
  },

  subCodingPopUpOpen: false,
  subCodingPopUpReadOnly: true,
  setSubCodingPopUpOpen: (value) => {
    set({ subCodingPopUpOpen: value });
  },
  setSubCodingPopUpReadOnly: (value) => {
    set({ subCodingPopUpReadOnly: value });
  },
}));

export default usePopUpsStore;
