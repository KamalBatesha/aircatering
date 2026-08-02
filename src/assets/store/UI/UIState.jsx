import toast from "react-hot-toast";
import { create } from "zustand";

// import {
//   GetCountries,
//   GetSocials,
//   GetTypes,
// } from "../../Api/HR/Employees/Employees";

// Create the store
const useUIStore = create((set, get) => ({
  isRightBarOpen: true,
  isRightBarForcedClicked: false,
  printThisOnly: false,
  viewMode: "list",
  isBalanceOpen: false,
  isDebtOpen: false,
  hoverPanelActiveTab: "balances",
  showAbsoluteHeader: false,
  selectedDepartment: null,
  printableSection: null,
  selectedJob: null,
  selectedLocation: null,
  selectedEducation: null,
  selectedDocumentation: null,
  selectedSalaryAddition: null,
  selectedSalaryDeduction: null,
  selectedEmployee: null,
  selectedDownload: null,
  selectedEmployeeSchedule: null,
  isDarkMode: false,
  isStella: sessionStorage.getItem("isStella") === "true",
  setIsStella: (value) => {
    sessionStorage.setItem("isStella", JSON.stringify(value));
    set({ isStella: value });
  },
  isShareMode: false,
  outcomingShares: false,
  countries: [],
  socials: [],
  types: [],
  outcomingSharesEmployees: [],
  hideToggle: false,
  selectedDateReport: null,
  isMobileView: false,
  showNav: false,
  grid: null,
  selectedModify: "All",
  selectedEmpState: "All",
  gridOpenPopupId: null,
  employeesActiveTab: "0",
  balanceBankIsOpen: false,
  balanceCustodyIsOpen: false,
  //Outsoursing the Actions to the nav bar
  newEmployeePopUpOpen: false,
  openSalAdPopup: false,
  openSalDePopup: false,
  openEditCodingDepartments: false,
  truncateCols: false,
  //pur coding
  selectedPurGroup: null,
  selectedPurPackaging: null,
  selectedPurSubGroup: null,
  selectedPurBrand: null,
  selectedPurUnit: null,
  selectedPurItem: null,
  selectedPurSupplier: null,
  //purchasing
  selectedPurchasingItem: null,
  endMonthPopUp: false,
  sendMonthToFinancePopUp: false,
  unreadScheduleIds: [],
  navName: null,
  programMenuData: null,
  showAddSalaryAdditionsCoding: false,
  showAddAllowancesCoding: false,
  selectedReasonDeduction: null,
  showReasonDeductionAddPopup: false,
  setShowReasonDeductionAddPopup: (value) => set({ showReasonDeductionAddPopup: value }),
  setSelectedReasonDeduction: (value) => set({ selectedReasonDeduction: value }),
  setShowAddSalaryAdditionsCoding: (value) => set({ showAddSalaryAdditionsCoding: value }),
  setShowAddAllowancesCoding: (value) => set({ showAddAllowancesCoding: value }),
  setUnreadScheduleIds: (ids) => set({ unreadScheduleIds: ids }),
  markScheduleAsRead: (id) => {
    const currentIds = get().unreadScheduleIds;
    if (currentIds.includes(id)) {
      const newIds = currentIds.filter((i) => i !== id);
      set({ unreadScheduleIds: newIds });
      // Update localStorage as well
      const readIds = JSON.parse(localStorage.getItem("readScheduleIds") || "[]");
      if (!readIds.includes(id)) {
        readIds.push(id);
        localStorage.setItem("readScheduleIds", JSON.stringify(readIds));
      }
    }
  },

  //in/out Logs
  selectedAttLog: null,
  openChangeLog: false,
  //uset profile
  userPayrollMod: null,
  globalPayrollPopupOpen: false,
  globalPasswordPopupOpen: false,
  globalAttendanceQRActive: false,
  //requests
  selectedLoanRequest: null,
  selectedVacationRequest: null,
  //mods
  singleDayMod: null,
  fromDurationMod: null,
  toDurationMod: null,
  disabledRightBar: false,
  tasteTriggerPrint: null,
  salesInvoiceTriggerPrint: null,
  purchasingTriggerPrint: false,
  menuTriggerPrint: null,
  employeePrintTriger: false,

  activateSelection: false,
  itemsSelected: [],
  printMenu: false,
  isLabelSelectMode: false,
  selectedLabelEmployees: [],
  showLabelOptionsPopup: false,
  showQRDialog: false,
  cashPageActiveTab: "1",

  smartListExportConfig: null,
  triggerSmartListExportPdf: false,
  triggerSmartListExportExcel: false,

  setSelectedDepartment: (value) => set({ selectedDepartment: value }),
  setEmployeePrintTriger: (value) => set({ employeePrintTriger: value }),
  setSalesInvoiceTriggerPrint: (value) =>
    set({ salesInvoiceTriggerPrint: value }),
  setPurchasingTriggerPrint: (value) =>
    set({ purchasingTriggerPrint: value }),
  setMenuTriggerPrint: (value) =>
    set({ menuTriggerPrint: value }),
  setTasteTriggerPrint: (value) => set({ tasteTriggerPrint: value }),
  labelsRef: { current: null },
  setLabelsRef: (ref) => {
    if (ref?.current) {
      set({ labelsRef: { current: ref.current } });
    } else {
      set({ labelsRef: ref });
    }
  },
  employeeSignatureRef: { current: null },
  employeeLabelsRef: { current: null },
  setEmployeeSignatureRef: (ref) => {
    if (ref?.current) {
      set({ employeeSignatureRef: { current: ref.current } });
    } else {
      set({ employeeSignatureRef: ref });
    }
  },
  setEmployeeLabelsRef: (ref) => {
    if (ref?.current) {
      set({ employeeLabelsRef: { current: ref.current } });
    } else {
      set({ employeeLabelsRef: ref });
    }
  },
  selectedSignatureMonth: null,
  setSelectedSignatureMonth: (month) => set({ selectedSignatureMonth: month }),
  //
  // Actions
  setPrintThisOnly: (value) => set({ printThisOnly: value }),
  setPrintableSection: (value) => set({ printableSection: value }),

  toggleRightBar: (isManual = false) =>
    set((state) => {
      if (get().disabledRightBar) {
        console.log("disabledRightBar ==> ", get().disabledRightBar);
        return { isRightBarOpen: false };
      }
      const newState = !state.isRightBarOpen;
      localStorage.setItem("isRightBarOpen", JSON.stringify(newState));

      // Logic: If manual action:
      // - Manual Close (newState is false) -> Set isRightBarForcedClicked to true (disables auto-open)
      // - Manual Open (newState is true) -> Set isRightBarForcedClicked to false (enables auto-open)
      const forcedClicked = isManual ? !newState : state.isRightBarForcedClicked;

      return {
        isRightBarOpen: newState,
        isRightBarForcedClicked: forcedClicked,
      };
    }),
  setDisabledRightBar: (value) => {
    set({
      disabledRightBar: value,
      isRightBarOpen: false, // Close right bar if disabled
    });
  },
  setIsRightBarForcedClicked: (value) => {
    set({ isRightBarForcedClicked: value });
  },
  closeRightBar: () => {
    set({
      isRightBarOpen: false,
    });
  },
  toggleNav: () => {
    set((state) => {
      const newState = !state.showNav;
      return { showNav: newState };
    });
  },
  setAbsoluteHeader: (data) => {
    set({ showAbsoluteHeader: data });
  },
  setGrid: (grid) => {
    set({ grid: grid });
  },
  setViewMode: (mode) => {
    const isMobileView = get().isMobileView;

    if (isMobileView) {
      toast.error("List View Not Allowed on Mobile!", { icon: "⚠️" });
      localStorage.setItem("viewMode", "grid");
      set({ viewMode: "grid" });
    } else {
      localStorage.setItem("viewMode", mode);
      set({ viewMode: mode });
    }
  },
  setselectedDepartment: (item) => {
    set({
      selectedDepartment: item,
      showAbsoluteHeader: true,
    });
  },
  setselectedDownload: (item) => {
    set({
      selectedDownload: item,
      showAbsoluteHeader: true,
    });
  },

  setselectedJob: (item) => {
    set({
      selectedJob: item,
      showAbsoluteHeader: true,
    });
  },
  setSelectedDate: (date) => {
    set({ selectedDateReport: date });
  },
  setHideToggle: () => {
    set({ hideToggle: true });
  },
  RemoveHideToggle: () => {
    set({ hideToggle: false });
  },
  toggleDarkMode: () =>
    set((state) => {
      const newState = !state.isDarkMode;
      //console.log(newState);
      //console.log("togle darkmode!");
      localStorage.setItem("darkMode", JSON.stringify(newState));
      return { isDarkMode: newState };
    }),
  setselectedEducation: (item) => {
    set({
      selectedEducation: item,
      showAbsoluteHeader: true,
    });
  },
  setSelectedDocumentation: (item) => {
    set({
      selectedDocumentation: item,
      showAbsoluteHeader: true,
    });
  },
  setSelectedSalaryAddition: (item) => {
    set({
      selectedSalaryAddition: item,
      showAbsoluteHeader: true,
    });
  },
  setSelectedSalaryDeduction: (item) => {
    set({
      selectedSalaryDeduction: item,
      showAbsoluteHeader: true,
    });
  },

  setSelectedEmployee: (item) => {
    set({
      selectedEmployee: item,
      showAbsoluteHeader: true,
    });
  },
  setSelectedNestedEmployee: (item) => {
    set({
      selectedEmployee: item,
      showAbsoluteHeader: false,
    });
  },
  setSelectedLocation: (item) => {
    set({
      selectedLocation: item,
      showAbsoluteHeader: true,
    });
  },
  getCountries: async () => {
    //console.log("getcountries");
    const fetchedCountries = await GetCountries();
    const typesStatus = await GetTypes();
    const socialStatuses = await GetSocials();
    set({
      countries: fetchedCountries,
      socials: socialStatuses,
      types: typesStatus,
    });
  },
  setMobileView: (item) => {
    set({ isMobileView: item });
  },
  removeSelectedItem: () => {
    set({
      selectedDownload: null,
      selectedDepartment: null,
      selectedJob: null,
      selectedLocation: null,
      selectedEducation: null,
      selectedEmployee: null,
      selectedDocumentation: null,
      selectedSalaryAddition: null,
      selectedSalaryDeduction: null,
      selectedEmployeeSchedule: null,
      showAbsoluteHeader: false,
      selectedPurGroup: null,
      selectedPurPackaging: null,
      selectedPurSubGroup: null,
      selectedPurBrand: null,
      selectedPurUnit: null,
      selectedPurItem: null,
      selectedPurSupplier: null,
      selectedPurchasingItem: null,
      selectedReasonDeduction: null,
    });
  },
  initializeUIState: async () => {
    const savedRightBarState = localStorage.getItem("isRightBarOpen");
    const savedViewMode = localStorage.getItem("viewMode");
    const savedDarkMode = localStorage.getItem("darkMode");

    set({
      isStella: sessionStorage.getItem("isStella") === "true",
      isRightBarOpen:
        savedRightBarState !== null ? JSON.parse(savedRightBarState) : true,
      viewMode: savedViewMode || "list",
      selectedDepartment: null,
      selectedJob: null,
      selectedLocation: null,
      selectedEducation: null,
      selectedEmployee: null,
      selectedDownload: null,
      selectedDocumentation: null,
      showAbsoluteHeader: false,
      isDarkMode: savedDarkMode ? JSON.parse(savedDarkMode) : false,
      countries: [],
      hideToggle: false,
      selectedDateReport: null,
      isMobileView: false,
      showNav: false,
      grid: null,
    });
  },
  setShowAbsoluteHeader: (value) => set({ showAbsoluteHeader: value }),
  setNewEmployeePopUpOpen: (value) => set({ newEmployeePopUpOpen: value }),
  setOpenSalAdPopup: (value) => set({ openSalAdPopup: value }),
  setOpenSalDePopup: (value) => set({ openSalDePopup: value }),
  setOpenEditCodingDepartments: (value) =>
    set({ openEditCodingDepartments: value }),
  setIsShareMode: (value) => set({ isShareMode: value }),
  setTruncateCols: (value) => set({ truncateCols: value }),
  setSelectedModify: (value) => set({ selectedModify: value }),
  setSelectedEmpState: (value) => set({ selectedEmpState: value }),
  setGridOpenPopupId: (id) => set({ gridOpenPopupId: id }),
  setSelectedEmployeeSchedule: (value) =>
    set({ selectedEmployeeSchedule: value, showAbsoluteHeader: true }),
  openRightBar: () => {
    if (get().disabledRightBar) return; // Prevent opening when disabled
    set({ isRightBarOpen: true });
  },
  setSelectedPurGroup: (value) => set({ selectedPurGroup: value }),
  setSelectedPurPackaging: (value) => set({ selectedPurPackaging: value }),
  setSelectedPurSubGroup: (value) => set({ selectedPurSubGroup: value }),
  setSelectedPurBrand: (value) => set({ selectedPurBrand: value }),
  setSelectedPurUnit: (value) => set({ selectedPurUnit: value }),
  setSelectedPurItem: (value) => set({ selectedPurItem: value }),
  setSelectedPurSupplier: (value) => set({ selectedPurSupplier: value }),
  setSelectedPurchasingItem: (value) => set({ selectedPurchasingItem: value }),
  setEndMonthPopUp: (value) => set({ endMonthPopUp: value }),
  setSendMonthToFinancePopUp: (value) =>
    set({ sendMonthToFinancePopUp: value }),
  setUserPayrollMod: (value) => set({ userPayrollMod: value }),
  setGlobalPayrollPopupOpen: (value) => set({ globalPayrollPopupOpen: value }),
  setGlobalPasswordPopupOpen: (value) => set({ globalPasswordPopupOpen: value }),
  setGlobalAttendanceQRActive: (value) => set({ globalAttendanceQRActive: value }),
  setSelectedAttLog: (value) => set({ selectedAttLog: value }),
  setSingleDayMod: (value) => set({ singleDayMod: value }),
  setOpenChangeLog: (value) => set({ openChangeLog: value }),
  setFromDurationMod: (value) => set({ fromDurationMod: value }),
  setToDurationMod: (value) => set({ toDurationMod: value }),
  setSelectedLoanRequest: (value) => set({ selectedLoanRequest: value }),
  setSelectedVacationRequest: (value) =>
    set({ selectedVacationRequest: value }),
  isEmployeeInOutTabActive: false,
  setIsEmployeeInOutTabActive: (value) =>
    set({ isEmployeeInOutTabActive: value }),
  setEmployeesActiveTab: (value) => set({ employeesActiveTab: value }),

  // Employee Logs Multi-Select
  isEmployeeLogsMultiSelect: false,
  setIsEmployeeLogsMultiSelect: (value) =>
    set({ isEmployeeLogsMultiSelect: value }),
  selectedEmployeesForPrint: [],
  setSelectedEmployeesForPrint: (list) =>
    set({ selectedEmployeesForPrint: list }),
  addEmployeeForPrint: (employee) =>
    set((state) => ({
      selectedEmployeesForPrint: state.selectedEmployeesForPrint.some(
        (e) => e.personalId === employee.personalId
      )
        ? state.selectedEmployeesForPrint.filter(
          (e) => e.personalId !== employee.personalId
        )
        : [...state.selectedEmployeesForPrint, employee],
    })),
  clearSelectedEmployeesForPrint: () => set({ selectedEmployeesForPrint: [] }),

  // Employee list for Select All feature
  employeeLogsListForSelection: [],
  setEmployeeLogsListForSelection: (list) =>
    set({ employeeLogsListForSelection: list }),
  openChatBox: false,
  setOpenChatBox: (value) => set({ openChatBox: value }),
  setIsBalanceOpen: (value) => set({ isBalanceOpen: value }),
  setIsDebtOpen: (value) => set({ isDebtOpen: value }),
  toggleDebt: () => set((state) => ({ isDebtOpen: !state.isDebtOpen })),
  setHoverPanelActiveTab: (tab) => set({ hoverPanelActiveTab: tab }),
  setBalanceBankIsOpen: (value) => set({ balanceBankIsOpen: value }),
  setBalanceCustodyIsOpen: (value) => set({ balanceCustodyIsOpen: value }),
  setActivateSelection: (value) => {
    set({ activateSelection: value });
  },
  setItemsSelected: (value) => {
    if (typeof value === "function") {
      set((state) => ({ itemsSelected: value(state.itemsSelected) }));
    } else {
      set({ itemsSelected: value });
    }
  },
  setPrintMenu: (value) => set({ printMenu: value }),
  setIsLabelSelectMode: (value) => set({ isLabelSelectMode: value }),
  setSelectedLabelEmployees: (value) => {
    if (typeof value === "function") {
      set((state) => ({
        selectedLabelEmployees: value(state.selectedLabelEmployees),
      }));
    } else {
      set({ selectedLabelEmployees: value });
    }
  },
  setShowLabelOptionsPopup: (value) => set({ showLabelOptionsPopup: value }),
  setShowQRDialog: (value) => set({ showQRDialog: value }),
  setNavName: (value) => set({ navName: value }),
  setProgramMenuData: (value) => set({ programMenuData: value }),
  setCashPageActiveTab: (value) => set({ cashPageActiveTab: value }),

  setSmartListExportConfig: (value) => set({ smartListExportConfig: value }),
  setTriggerSmartListExportPdf: (value) => set({ triggerSmartListExportPdf: value }),
  setTriggerSmartListExportExcel: (value) => set({ triggerSmartListExportExcel: value }),
}));

export default useUIStore;
