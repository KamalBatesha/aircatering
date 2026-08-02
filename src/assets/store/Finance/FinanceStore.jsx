import { create } from "zustand";

const useFinanceStore = create((set) => ({
  selectedCustody: null,
  selectedCustodyDetailsItems: null,
  returnActiveTab: "1",

  gmView: false,
  payedList: false,
  payPopUp: false,
  selectedCashTransaction: null,
  newPittyCash: false,
  newZASPittyCash: false,
  newCashToBank: false,
  editCashToBank: false,
  newCashFromBank: false,
  editCashFromBank: false,
  newBankExpenses: false,
  editBankExpenses: false,
  newCustody: false,
  editCustody: false,
  newTrnFromSafe: false,
  editTrnFromSafe: false,
  editPayroll: false,
  newAddFromPartner: false,
  newReturnToPartner: false,
  editReturnToPartner: false,
  newReturnToCompany: false,
  editReturnToCompany: false,
  newAddFromCompany: false,
  editAddFromCompany: false,
  newOtherIncome: false,
  editOtherIncome: false,
  editAddFromPartner: false,
  gmApproval: false,
  selectedInvoice: null,
  newClientCollection: false,
  selectedCreditPurchsaing: null,
  selectedInvoices: [],
  clientInvoicePay: false,
  toPayInvoices: [],
  payLoan: false,
  selectedLoans: [],
  cashGMView: false,
  newCreditPurchasingPopUp: false,
  editCreditPurchasingPopUp: false,
  chequesList: false,
  isPayed: false,
  trnToSafe: false,
  addChequeBook: false,
  selectedChequeBook: null,
  selectedCheque: null,
  salesFeesPriceUpdate: false,
  newCurrancyTransfer: false,
  actionType: null,
  codingPageType: null,
  selectedCodingItem: null,
  popupActionType: null,
  financeSuppliersPopup: false,
  expenseGroupPopup: false,
  expenseSubGroupPopup: false,
  expenseCodePopup: false,
  bankCodingPopup: false,
  bankAccountPopup: false,
  custodyReasonPopup: false,
  itemsSelected: [],
  activateSelection: false,
  currentReturnPageItems: [],
  showBulkClose: false,

  //inner nav
  creditPurchasingList: [],
  cashTransactionList: [],

  setSelectedCustody: (value) => {
    set({ selectedCustody: value });
  },
  setGmView: (value) => {
    set({ gmView: value });
  },
  setSelectedCustodyDetailsItems: (value) => {
    set({ selectedCustodyDetailsItems: value });
  },
  setPayedList: (value) => {
    set({ payedList: value });
  },
  setPayPopUp: (value) => {
    set({ payPopUp: value });
  },
  setSelectedCashTransaction: (value) => {
    set({ selectedCashTransaction: value });
  },
  setNewPittyCash: (value) => {
    set({ newPittyCash: value });
  },
  setNewZASPittyCash: (value) => {
    set({ newZASPittyCash: value });
  },
  setNewCashToBank: (value) => {
    set({ newCashToBank: value });
  },
  setEditCashToBank: (value) => {
    set({ editCashToBank: value });
  },
  setNewCashFromBank: (value) => {
    set({ newCashFromBank: value });
  },
  setEditCashFromBank: (value) => {
    set({ editCashFromBank: value });
  },
  setNewBankExpenses: (value) => {
    set({ newBankExpenses: value });
  },
  setEditBankExpenses: (value) => {
    set({ editBankExpenses: value });
  },
  setNewCustody: (value) => {
    set({ newCustody: value });
  },
  setEditCustody: (value) => {
    set({ editCustody: value });
  },
  setNewCustody1: (value) => {
    set({ newCustody1: value });
  },
  setEditCustody1: (value) => {
    set({ editCustody1: value });
  },
  setNewTrnFromSafe: (value) => {
    set({ newTrnFromSafe: value });
  },
  setEditTrnFromSafe: (value) => {
    set({ editTrnFromSafe: value });
  },
  setEditPayroll: (value) => {
    set({ editPayroll: value });
  },
  setGmApproval: (value) => {
    set({ gmApproval: value });
  },
  setNewAddFromPartner: (value) => {
    set({ newAddFromPartner: value });
  },
  setSalesFeesPriceUpdate: (value) => {
    set({ salesFeesPriceUpdate: value });
  },
  setNewReturnToPartner: (value) => {
    set({ newReturnToPartner: value });
  },
  setEditReturnToPartner: (value) => {
    set({ editReturnToPartner: value });
  },
  setNewReturnToCompany: (value) => {
    set({ newReturnToCompany: value });
  },
  setEditReturnToCompany: (value) => {
    set({ editReturnToCompany: value });
  },
  setNewOtherIncome: (value) => {
    set({ newOtherIncome: value });
  },
  setEditOtherIncome: (value) => {
    set({ editOtherIncome: value });
  },
  setChequesList: (value) => {
    set({ chequesList: value });
  },
  setNewAddFromCompany: (value) => {
    set({ newAddFromCompany: value });
  },
  setEditAddFromCompany: (value) => {
    set({ editAddFromCompany: value });
  },
  setEditAddFromPartner: (value) => {
    set({ editAddFromPartner: value });
  },
  setIsPayed: (value) => {
    set({ isPayed: value });
  },
  setTrnToSafe: (value) => {
    set({ trnToSafe: value });
  },
  setAddChequeBook: (value) => {
    set({ addChequeBook: value });
  },
  setSelectedChequeBook: (value) => {
    set({ selectedChequeBook: value });
  },
  setSelectedCheque: (value) => {
    set({ selectedCheque: value });
  },
  setNewCurrancyTransfer: (value) => {
    set({ newCurrancyTransfer: value });
  },
  setCodingPageType: (value) => set({ codingPageType: value }),
  setSelectedCodingItem: (value) => set({ selectedCodingItem: value }),
  setPopupActionType: (value) => set({ popupActionType: value }),
  setFinanceSuppliersPopup: (value) => set({ financeSuppliersPopup: value }),
  setExpenseGroupPopup: (value) => set({ expenseGroupPopup: value }),
  setExpenseSubGroupPopup: (value) => set({ expenseSubGroupPopup: value }),
  setExpenseCodePopup: (value) => set({ expenseCodePopup: value }),
  setBankCodingPopup: (value) => set({ bankCodingPopup: value }),
  setBankAccountPopup: (value) => set({ bankAccountPopup: value }),
  setCustodyReasonPopup: (value) => set({ custodyReasonPopup: value }),
  closePopUps: () => {
    set({
      newPittyCash: false,
      newCashToBank: false,
      editCashToBank: false,
      newCashFromBank: false,
      editCashFromBank: false,
      newBankExpenses: false,
      editBankExpenses: false,
      newCustody: false,
      editCustody: false,
      newCustody1: false,
      editCustody1: false,
      newTrnFromSafe: false,
      editTrnFromSafe: false,
      editPayroll: false,
      newAddFromPartner: false,
      editAddFromPartner: false,
      newReturnToPartner: false,
      editReturnToPartner: false,
      newAddFromCompany: false,
      editAddFromCompany: false,
      newReturnToCompany: false,
      editReturnToCompany: false,
      newOtherIncome: false,
      editOtherIncome: false,
      trnToSafe: false,
      chequesList: false,
    });
  },
  setSelectedInvoice: (value) => {
    set({ selectedInvoice: value });
  },
  setNewClientCollection: (value) => {
    set({ newClientCollection: value });
  },
  setSelectedCreditPurchasing: (value) => {
    set({ selectedCreditPurchasing: value });
  },
  setSelectedInvoices: (invoice) => {
    set((state) => {
      const exists = state.selectedInvoices.some(
        (inv) => inv.invoiceID === invoice.invoiceID
      );

      return {
        selectedInvoices: exists
          ? state.selectedInvoices.filter(
              (inv) => inv.invoiceID !== invoice.invoiceID
            ) // Remove if exists
          : [...state.selectedInvoices, invoice], // Add if not exists
      };
    });
  },
  setClientInvoicePay: (value) => {
    set({ clientInvoicePay: value });
  },
  setToPayInvoices: (value) => {
    set({ toPayInvoices: value });
  },
  setPayLoan: (value) => {
    set({ payLoan: value });
  },
  setSelectedLoans: (loan) => {
    set((state) => {
      // If an empty array is passed, reset selectedLoans
      if (Array.isArray(loan) && loan.length === 0) {
        return { selectedLoans: [] };
      }

      const exists = state.selectedLoans.some(
        (inv) => inv.detailID === loan.detailID
      );

      return {
        selectedLoans: exists
          ? state.selectedLoans.filter((inv) => inv.detailID !== loan.detailID) // Remove if exists
          : [...state.selectedLoans, loan], // Add if not exists
      };
    });
  },
  setCashGMView: (value) => {
    set({ cashGMView: value });
  },
  setNewCreditPurchasingPopUp: (value) => {
    set({ newCreditPurchasingPopUp: value });
  },
  setEditCreditPurchasingPopUp: (value) => {
    set({ editCreditPurchasingPopUp: value });
  },
  setCreditPurchasingList: (value) => {
    set({ creditPurchasingList: value });
  },
  setCashTransactionList: (value) => {
    set({ cashTransactionList: value });
  },
  setActionType: (value) => {
    set({ actionType: value });
  },
  setReturnActiveTab: (value) => {
    set({ returnActiveTab: value });
  },
  setItemsSelected: (value) => {
    if (typeof value === "function") {
      set((state) => ({ itemsSelected: value(state.itemsSelected) }));
    } else {
      set({ itemsSelected: value });
    }
  },
  setActivateSelection: (value) => {
    set({ activateSelection: value });
  },
  setCurrentReturnPageItems: (value) => {
    set({ currentReturnPageItems: value });
  },
  setShowBulkClose: (value) => {
    set({ showBulkClose: value });
  },
}));

export default useFinanceStore;
