import { create } from "zustand";

const UseInventoryStore = create((set) => ({
  selectedPurchasingOrder: null,
  selectedPreparedOrder: null,
  selectedKitchenRequest: null,
  selectedInnerItem: null,
  innerItemEdit: false,
  selectedPreparationRequest: null,
  newPrepRequestPopUp: false,
  selectedEmployeeRequest: null,
  selectedReport: null,
  itemTrnType: null,
  departmentId: false,

  //Kitchen Inv
  selectedMainInvRequest: null,
  selectedDepRequest: null,
  mainInvFilter: "R",
  addStorePopup: false,
  selectedStore: null,
  selectedSector: null,

  //inner nav
  reports: [],
  purchasingOrders: [],
  kitchenRequests: [],
  employeeRequests: [],
  mainRequests: [],
  depRequests: [],

  popupActionType: null,
  setPopupActionType: (value) => {
    set({ popupActionType: value });
  },
  addStoreCodingPopup: false,
  setAddStoreCodingPopup: (value) => {
    set({ addStoreCodingPopup: value });
  },

  addSectorCodingPopup: false,
  setAddSectorCodingPopup: (value) => {
    set({ addSectorCodingPopup: value });
  },
  selectedCodingItem: null,
  setSelectedCodingItem: (value) => {
    set({ selectedCodingItem: value });
  },
  
  setSelectedPurchasingOrder: (value) => {
    set({ selectedPurchasingOrder: value });
  },

  setSelectedKitchenRequest: (value) => {
    set({ selectedKitchenRequest: value });
  },

  setSelectedInnerItem: (value) => {
    set({ selectedInnerItem: value });
  },

  setInnerItemEdit: (value) => {
    set({ innerItemEdit: value });
  },

  setSelectedPreparationRequest: (value) => {
    set({ selectedPreparationRequest: value });
  },

  setNewPrepRequestPopUp: (value) => {
    set({ newPrepRequestPopUp: value });
  },

  setSelectedMainInvRequest: (value) => {
    set({ selectedMainInvRequest: value });
  },

  setSelectedDepRequest: (value) => {
    set({ selectedDepRequest: value });
  },

  setMainInvFilter: (value) => {
    set({ mainInvFilter: value });
  },

  setSelectedEmployeeRequest: (value) => {
    set({ selectedEmployeeRequest: value });
  },

  setSelectedReport: (value) => {
    set({ selectedReport: value });
  },

  setItemTrnType: (value) => {
    set({ itemTrnType: value });
  },

  setReports: (value) => {
    set({ reports: value });
  },

  setPurchasingOrders: (value) => {
    set({ purchasingOrders: value });
  },

  setKitchenRequests: (value) => {
    set({ kitchenRequests: value });
  },

  setEmployeeRequests: (value) => {
    set({ employeeRequests: value });
  },

  setMainRequests: (value) => {
    set({ mainRequests: value });
  },

  setDepRequests: (value) => {
    set({ depRequests: value });
  },
  setAddStorePopup: (value) => {
    set({ addStorePopup: value });
  },
  setSelectedStore: (value) => {
    set({ selectedStore: value });
  },
  setSelectedSector: (value) => {
    set({ selectedSector: value });
  },
  setDepartmentId: (value) => {
    set({ departmentId: value });
  },
  setSelectedPreparedOrder: (value) => {
    set({ selectedPreparedOrder: value });
  }
}));

export default UseInventoryStore;
