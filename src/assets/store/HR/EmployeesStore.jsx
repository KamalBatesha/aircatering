import { create } from "zustand";

// Create the store
const useEmployeesStore = create((set) => ({
  isReadOnly: true,
  isClickable: false,
  empStatus: "active",
  //next - prev - back in employee data view
  currentOrder: null,
  currentID: null,
  employees: [],
  isBackButton: false,
  docDataPopUp: false,
  payrollView: null,
  selectedPerson: null,
  newApplicantPopUpOpen: false,
  hireApplicationPopUpOpen: false,

  fromOverallSchedule: false,
  incDecPopUp: false,
  // Actions

  //Coding
  openJobCoding: false,
  openLocationCoding: false,
  openEducationCoding: false,
  openDocumentationCoding: false,
  openSalaryAdditionCoding: false,
  openSalaryDeductionCoding: false,

  newEmployeePopUpOpen: false,

  setReadOnly: () => {
    set({
      isReadOnly: true,
    });
  },
  setIsClickable: (item) => {
    set({
      isClickable: item,
    });
  },
  setEdit: () => {
    set({
      isReadOnly: false,
    });
  },

  initializeEmployeesState: () => {
    set({
      isReadOnly: true,
      isClickable: false,
    });
  },

  setCurrentOrder: (item) => {
    set({
      currentOrder: item,
    });
  },
  setCurrentID: (item) => {
    set({
      currentID: item,
    });
  },
  setEmployees: (item) => {
    set({
      employees: item,
    });
  },
  setIsBackButton: (value) => {
    set({
      isBackButton: value,
    });
  },
  setEmpStatus: (value) => {
    set({
      empStatus: value,
    });
  },
  setDocDataPopUp: (value) => {
    set({
      docDataPopUp: value,
    });
  },
  setNewEmployeePopUpOpen: (value) => {
    set({ newEmployeePopUpOpen: value });
  },
  setIncDecPopUp: (value) => {
    set({ incDecPopUp: value });
  },
  setPayrollView: (value) => {
    set({ payrollView: value });
  },
  setFromOverallSchedule: (value) => {
    set({ fromOverallSchedule: value });
  },
  setSelectedPerson: (value) => {
    set({ selectedPerson: value });
  },
  setNewApplicantPopUpOpen: (value) => {
    set({ newApplicantPopUpOpen: value });
  },
  setHireApplicationPopUpOpen: (value) => {
    set({ hireApplicationPopUpOpen: value });
  },

  //Coding
  setOpenJobCoding: (value) => {
    set({ openJobCoding: value });
  },
  setOpenLocationCoding: (value) => {
    set({ openLocationCoding: value });
  },
  setOpenEducationCoding: (value) => {
    set({ openEducationCoding: value });
  },
  setOpenDocumentationCoding: (value) => {
    set({ openDocumentationCoding: value });
  },
  setOpenSalaryAdditionCoding: (value) => {
    set({ openSalaryAdditionCoding: value });
  },
  setOpenSalaryDeductionCoding: (value) => {
    set({ openSalaryDeductionCoding: value });
  },
}));

export default useEmployeesStore;
