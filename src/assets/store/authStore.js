import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  userFullData: JSON.parse(localStorage.getItem("userData")) || null,
  userShowFullData: null,
  loading: true,

  userSecuredData: false,
  quatationData: null,
  login: (userData) => {
    set({ user: userData });
    localStorage.setItem("user", JSON.stringify(userData));
  },
  setUserData: (userData) => {
    set({ userFullData: userData });
    localStorage.setItem("userData", JSON.stringify(userData));
  },
  logout: () => {
    set({ user: null });
    localStorage.removeItem("user");
    // Clear profile popup dismissal states so it shows again on next login
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith("profilePopupDismissed_")) {
        sessionStorage.removeItem(key);
      }
    });
  },
  setLoading: (loading) => set({ loading }),
  setUserShowFullData: (data) => {
    set({ userShowFullData: data });
  },
  setUserSecuredData: (data) => {
    set({ userSecuredData: data });
  },
  setQuatationData: (data) => {
    set({ quatationData: data });
  },
}));
export default useAuthStore;
