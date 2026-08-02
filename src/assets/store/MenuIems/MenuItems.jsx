import { create } from "zustand";

const getStoredItem = (key) => {
  try {
    const item = localStorage.getItem(key);
    console.log("initializeMenuState", item);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
};

// Create the store
const useMenuStore = create((set) => ({
  levelOneActive: getStoredItem("levelOneActive"),
  levelTwoActive: getStoredItem("levelTwoActive"),
  levelThreeActive: getStoredItem("levelThreeActive"),
  addMenuItems: [],
  // Actions
  setLevelOneActive: (item) => {
    set({
      levelOneActive: item,
      levelTwoActive: null,
      levelThreeActive: null,
    });
    localStorage.setItem("levelOneActive", JSON.stringify(item));
    localStorage.removeItem("levelTwoActive");
    localStorage.removeItem("levelThreeActive");
  },
  setLevelTwoActive: (item) => {
    set({
      levelTwoActive: item,
      levelThreeActive: null,
    });
    localStorage.setItem("levelTwoActive", JSON.stringify(item));
    localStorage.removeItem("levelThreeActive");
  },
  setLevelThreeActive: (item) => {
    //console.log(item);
    set({ levelThreeActive: item });
    localStorage.setItem("levelThreeActive", JSON.stringify(item));
  },
  setAddMenuItems: (items) => {
    set({ addMenuItems: items });
  },
  initializeMenuState: () => {
    set({
      levelOneActive: getStoredItem("levelOneActive"),
      levelTwoActive: getStoredItem("levelTwoActive"),
      levelThreeActive: getStoredItem("levelThreeActive"),
      addMenuItems: [],
    });
  },
}));

export default useMenuStore;
