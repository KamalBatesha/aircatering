import { create } from "zustand";

export const clearGuestStorage = () => {
  try {
    localStorage.removeItem("GUEST_SUBMITTED_ORDER");
    localStorage.removeItem("guestFormData");
    sessionStorage.removeItem("guestCreateOrderDraft");

    Object.keys(localStorage).forEach((key) => {
      if (key.toLowerCase().includes("guest")) {
        localStorage.removeItem(key);
      }
    });

    Object.keys(sessionStorage).forEach((key) => {
      if (key.toLowerCase().includes("guest")) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (err) {
    console.error("Failed to clear guest storage", err);
  }
};

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
    clearGuestStorage();
  },
  setUserData: (userData) => {
    set({ userFullData: userData });
    localStorage.setItem("userData", JSON.stringify(userData));
  },
  logout: () => {
    set({ user: null, userFullData: null, userShowFullData: null, quatationData: null });
    localStorage.removeItem("user");
    localStorage.removeItem("userData");
    clearGuestStorage();
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
