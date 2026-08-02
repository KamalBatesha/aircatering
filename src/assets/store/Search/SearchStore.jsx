import { create } from "zustand";

import { advancedSearchConfig } from "../../constants/config";

const useSearchBarStore = create((set) => ({
  currentPage: "",
  advancedOptions: [],
  searchQuery: "",
  searchParam: [],

  setCurrentPage: (page) => set({ currentPage: page }),
  setSearchParam: (param) => set({ searchParam: param }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  getAdvancedSearchOptions: () => {
    const { currentPage } = useSearchBarStore.getState();

    //? Modify search to support wildcards
    let newAdvancedOptions = advancedSearchConfig[currentPage];
    if (!newAdvancedOptions) {
      const configKeys = Object.keys(advancedSearchConfig);
      const matchingKey = configKeys.find((key) => {
        if (key.includes("*")) {
          const pattern = key.replace(/\*/g, ".*").replace(/\//g, "\\/");
          const regex = new RegExp(`^${pattern}$`);
          return regex.test(currentPage);
        }
        return false;
      });

      if (matchingKey) {
        newAdvancedOptions = advancedSearchConfig[matchingKey];
      }
    }
    newAdvancedOptions = newAdvancedOptions || [];

    set({
      advancedOptions: newAdvancedOptions,
      searchQuery: "",
      searchParam: newAdvancedOptions.length > 0 ? newAdvancedOptions : [],
    });
  },

  resetSearch: () =>
    set({
      searchQuery: "",
      searchParam: [],
      advancedOptions: [],
    }),
}));
export default useSearchBarStore;
