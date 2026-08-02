import { create } from "zustand";
import { persist } from "zustand/middleware";

import getDashboardDateRange from "../../Helpers/DashboardDefaultDateRange";

const { ThisMonthStart, ThisMonthEnd, weekBeforeToday, oneMonthAfterToday } =
  getDashboardDateRange();

const useDashboardStore = create(
  persist(
    (set) => ({
      // Default date range values
      begDate: weekBeforeToday,
      endDate: oneMonthAfterToday,

      // Default currency
      dashboardCurrency: 1,

      // Default selected period
      selectedDatePeriod: "Month",

      multiSelectMode: false,

      multiSelectModes: {
        flight: false,
        individual: false,
        ground: false,
      },

      selectedRelatedFlights: [],

      setBegDate: (item) => {
        set({
          begDate: item,
        });
      },

      setEndDate: (item) => {
        set({
          endDate: item,
        });
      },

      setDashboardCurrency: (item) => {
        set({
          dashboardCurrency: item,
        });
      },

      setSelectedDatePeriod: (item) => {
        set({
          selectedDatePeriod: item,
        });
      },

      setMultiSelectMode: (value, type) => {
        if (type) {
          set((state) => ({
            multiSelectModes: { ...state.multiSelectModes, [type]: value },

            // Keep compatibility with old logic using single flag
            multiSelectMode: value,
          }));
        } else {
          set({ multiSelectMode: value });
        }
      },

      setSelectedRelatedFlights: (list) =>
        set({ selectedRelatedFlights: list }),

      resetSelection: (type) => {
        set((state) => {
          const newModes = type
            ? { ...state.multiSelectModes, [type]: false }
            : { flight: false, individual: false, ground: false };

          return {
            multiSelectModes: newModes,
            multiSelectMode: type ? state.multiSelectMode : false,
            selectedRelatedFlights: [],
          };
        });

        // Clear related cached selections from localStorage
        localStorage.removeItem("selectedRelatedFlights");
        localStorage.removeItem("selectedFields");
        localStorage.removeItem("selectedText");
      },
    }),
    {
      name: "dashboard-store", // Storage key inside localStorage

      // Only persist specific values to avoid unwanted state restoration
      // This ensures that only filters like date and currency stay after refresh
      partialize: (state) => ({
        begDate: state.begDate,
        endDate: state.endDate,
        dashboardCurrency: state.dashboardCurrency,
        selectedDatePeriod: state.selectedDatePeriod,
      }),
    }
  )
);

export default useDashboardStore;
