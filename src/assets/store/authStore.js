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
