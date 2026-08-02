import { create } from "zustand";
import { persist } from "zustand/middleware";
import useUIStore from "../UI/UIState";

const useSalesStore = create(
  persist(
    (set) => ({
      openRightBar: useUIStore.getState().openRightBar,
      disabledRightBar: useUIStore.getState().disabledRightBar,
      selectedQuotation: null,
      selectedQuotationPos: null,
      selectedIndividual: null,
      selectedGround: null,
      selectedFullQuotation: null,
      selectedQuotDetails: null,
      selectedZasClient: null,
      managerViewType: "K",
      GMView: false,
      GMArchiveView: false,
      GMCancelView: false,
      GMExpiredView: false,
      ClosedByZasView: false,
      operationView: false,
      salesView: false,
      GMApprovalPopUp: false,
      newEmailPopup: false,
      //orderListStatus: "C",
      currency: "USD",
      areAllOrderItemsDone: false,
      areAllOrderItemsReviewed: false,
      exportToExcelWithPrices: false,
      exportToExcelWithoutPrices: false,
      openApprovePopup: false,
      moreDetailsPopup: false,
      alarmPopup: true,
      alarmPendingPopup: false,
      alarmExpiredPopup: false,
      addOnPopup: false,
      addOnGroupPopup: false,
      counterFPC: null,
      pendingclosureList: [],
      preventNavigation: false,
      exportExcel: false,
      openClosedApprovePopup: false,
      documentType: null,
      foodItemList: [],

      setAddOnPopup: (value) => set({ addOnPopup: value }),
      setAddOnGroupPopup: (value) => set({ addOnGroupPopup: value }),
      setSelectedGround: (value) => set({ selectedGround: value }),
      setExportExcel: (value) => set({ exportExcel: value }),

      setExportToExcelWithPrices: (value) =>
        set({ exportToExcelWithPrices: value }),
      setExportToExcelWithoutPrices: (value) =>
        set({ exportToExcelWithoutPrices: value }),

      setAreAllOrderItemsDone: (isDone) => set({ areAllOrderItemsDone: isDone }),
      setAreAllOrderItemsReviewed: (isDone) =>
        set({ areAllOrderItemsReviewed: isDone }),
      setCurrency: (value) => set({ currency: value }),

      quotationList: [],
      zasFlightList: [],

      //Coding
      codingPageType: null,
      popupActionType: null,
      selectedCodingItem: null,
      salesCodingGMView: false,

      // Client Announcement Multi-Select
      clientAnnouncementSelectMode: false,
      selectedAnnouncementClients: [],

      agentPopup: false,
      foodItemPopup: false,
      operatorPopup: false,
      billToPopup: false,
      ACPopup: false,
      foodSupplierPopup: false,
      flightNumberPopup: false,
      registrationPopup: false,
      clientPopup: false,
      updateClientPopup: false,
      groupPopup: false,
      grandGroupPopup: false,
      SubGroupPopup: false,
      UnitPopup: false,
      addQuotationPopup: false,
      addIndividualPopup: false,
      addGroundPopup: false,
      docPopup: false,
      choosePosPopup: false,
      triggerPrint: false,
      triggerPrintSupplier: false,
      confirmationPopupOpen: false,
      onConfirmFn: null,
      handleInvoicePrint: null,

      setTriggerPrint: (item) => {
        set({
          triggerPrint: item,
        });
      },
      setTriggerPrintSupplier: (item) => {
        set({
          triggerPrintSupplier: item,
        });
      },
      setHandleInvoicePrint: (fn) => set({ handleInvoicePrint: fn }),
      setAddQuotationPopup: (value) => set({ addQuotationPopup: value }),
      setSelectedIndividual: (value) =>
        set((state) => {
          console.log("⚠️ selectedIndividual CHANGED");
          // console.log("OLD:", state.selectedIndividual?.orderHeaderStatusID);
          // console.log("NEW:", value?.orderHeaderStatusID);
          // console.trace(); // سيظهر الملف والسطر الذي استدعى التغيير

          return { selectedIndividual: value };
        }),
      setAddIndividualPopup: (value) => set({ addIndividualPopup: value }),
      setAddGroundPopup: (value) => set({ addGroundPopup: value }),
      setSelectedZasClient: (value) =>
        set((state) => {
          if (window.innerWidth > 1024 && !state.disabledRightBar) {
            console.log("window.innerWidth ==> ", window.innerWidth);
            state.openRightBar();
          }
          return { selectedZasClient: value };
        }),

      setSelectedQuotation: (value) =>
        set((state) => {
          if (window.innerWidth > 1024 && !state.disabledRightBar) {
            console.log("window.innerWidth ==> ", window.innerWidth);
            state.openRightBar();
          }
          return {
            selectedQuotation: value,
          };
        }),
      setSelectedQuotationPos: (value) =>
        set((state) => {
          return {
            selectedQuotationPos: value,
          };
        }),
      // setSelectedNeedPricing: (item) => {
      //   set((state) => {
      //     // if device is pc aka wide screen
      //     if (window.innerWidth > 1024 && !state.disabledRightBar) {
      //       console.log("window.innerWidth ==> ", window.innerWidth);
      //       state.openRightBar();
      //     }
      //     state.setSelectedFlight(item);
      //     return { selectedNeedPricing: item };
      //   });
      // },
      //setOrderListStatus: (value) => set({ orderListStatus: value }),
      setManagerViewType: (value) => set({ managerViewType: value }),
      setGMView: (value) => set({ GMView: value }),
      setOperationView: (value) => set({ operationView: value }),
      setGMArchiveView: (value) => set({ GMArchiveView: value }),
      setClosedByZasView: (value) => set({ ClosedByZasView: value }),
      setGMCancelView: (value) => set({ GMCancelView: value }),
      setGMApprovalPopUp: (value) => set({ GMApprovalPopUp: value }),
      setSalesView: (value) => set({ salesView: value }),
      setSelectedQuotDetails: (value) => set({ selectedQuotDetails: value }),
      setQuotationList: (value) => set({ quotationList: value }),
      setZasFlightList: (value) => set({ zasFlightList: value }),
      setCodingPageType: (value) => set({ codingPageType: value }),
      setSelectedCodingItem: (value) => set({ selectedCodingItem: value }),
      setPopupActionType: (value) => set({ popupActionType: value }),
      setAgentPopup: (value) => set({ agentPopup: value }),
      setFoodItemPopup: (value) => set({ foodItemPopup: value }),
      setSalesCodingGMView: (value) => set({ salesCodingGMView: value }),
      setClientAnnouncementSelectMode: (value) =>
        set({ clientAnnouncementSelectMode: value }),
      setSelectedAnnouncementClients: (value) =>
        set({ selectedAnnouncementClients: value }),
      toggleAnnouncementClient: (customerId) =>
        set((state) => ({
          selectedAnnouncementClients: state.selectedAnnouncementClients.includes(
            customerId
          )
            ? state.selectedAnnouncementClients.filter((id) => id !== customerId)
            : [...state.selectedAnnouncementClients, customerId],
        })),
      setOperatorPopup: (value) => set({ operatorPopup: value }),
      setBillToPopup: (value) => set({ billToPopup: value }),
      setACPopup: (value) => set({ ACPopup: value }),
      setFoodSupplierPopup: (value) => set({ foodSupplierPopup: value }),
      setFlightNumberPopup: (value) => set({ flightNumberPopup: value }),
      setRegistrationPopup: (value) => set({ registrationPopup: value }),
      setClientPopup: (value) => set({ clientPopup: value }),
      setUpdateClientPopup: (value) => set({ updateClientPopup: value }),
      setGroupPopup: (value) => set({ groupPopup: value }),
      setGrandGroupPopup: (value) => set({ grandGroupPopup: value }),
      setSubGroupPopup: (value) => set({ SubGroupPopup: value }),
      setUnitPopup: (value) => set({ UnitPopup: value }),
      setSelectedFullQuotation: (value) => set({ selectedFullQuotation: value }),
      setDocPopup: (item) => {
        set({
          docPopup: item,
        });
      },
      setChoosePosPopup: (item) => {
        set({
          choosePosPopup: item,
        });
      },

      setConfirmationPopupOpen: (value) => set({ confirmationPopupOpen: value }),
      setOnConfirmFn: (fn) => set({ onConfirmFn: fn }),
      setNewEmailPopup: (value) => set({ newEmailPopup: value }),
      setGMExpiredView: (value) => set({ GMExpiredView: value }),
      setOpenApprovePopup: (value) => set({ openApprovePopup: value }),
      setMoreDetailsPopup: (value) => set({ moreDetailsPopup: value }),
      setAlarmPopup: (value) => set({ alarmPopup: value }),
      setCounterFPC: (value) => set({ counterFPC: value }),
      setPendingclosureList: (value) => set({ pendingclosureList: value }),
      setAlarmPendingPopup: (value) => set({ alarmPendingPopup: value }),
      setAlarmExpiredPopup: (value) => set({ alarmExpiredPopup: value }),
      setPreventNavigation: (value) => set({ preventNavigation: value }),
      setOpenClosedApprovePopup: (value) => set({ openClosedApprovePopup: value }),
      setDocumentType: (value) => set({ documentType: value }),
      setFoodItemList: (value) => set({ foodItemList: value }),
    }),
    {
      name: "sales-store",
      partialize: (state) => ({
        selectedIndividual: state.selectedIndividual,
        selectedQuotation: state.selectedQuotation,
      }),
    }
  )
);

export default useSalesStore;
