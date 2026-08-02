import { create } from "zustand";

const useGlobalNavStore = create((set) => ({
  jobs: [],
  departments: [],
  locations: [],
  educations: [],
  documentations: [],
  salaryAdditions: [],
  salaryDeductions: [],
  dailyTransactions: [],
  deductions: [],
  transactions: [],
  employees: [],
  payrollList: [],
  vacationList: [],
  purGroups: [],
  purSubGroups: [],
  purBrands: [],
  purItems: [],
  scheduleList: [],

  // Actions
  setJobs: (data) => {
    set({
      jobs: data,
    });
  },
  setDepartments: (data) => {
    set({
      departments: data,
    });
  },
  setLocations: (data) => {
    set({
      locations: data,
    });
  },
  setEducations: (data) => {
    set({
      educations: data,
    });
  },
  setDocumentations: (data) => {
    set({
      documentations: data,
    });
  },
  setSalaryAdditions: (data) => {
    set({
      salaryAdditions: data,
    });
  },
  setSalaryDeductions: (data) => {
    set({
      salaryDeductions: data,
    });
  },
  setDailyTransactions: (data) => {
    set({
      dailyTransactions: data,
    });
  },
  setDeductions: (data) => {
    set({
      deductions: data,
    });
  },
  setTransactions: (data) => {
    set({
      transactions: data,
    });
  },
  setEmployees: (data) => {
    set({
      employees: data,
    });
  },
  setPayrollList: (data) => {
    set({
      payrollList: data,
    });
  },
  setVacationList: (data) => {
    set({
      vacationList: data,
    });
  },
  setPurGroups: (data) => {
    set({
      purGroups: data,
    });
  },
  setPurSubGroups: (data) => {
    set({
      purSubGroups: data,
    });
  },
  setPurBrands: (data) => {
    set({
      purBrands: data,
    });
  },
  setPurItems: (data) => {
    set({
      purItems: data,
    });
  },
  setScheduleList: (data) => {
    set({
      scheduleList: data,
    });
  },
}));

export default useGlobalNavStore;
