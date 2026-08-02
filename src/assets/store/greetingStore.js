import { create } from 'zustand';

const useGreetingStore = create((set) => ({
  isOpen: false,
  type: null, // 'welcome' | 'thankYou' | 'newsletter'
  name: null,
  onConfirm: null,
  
  showGreeting: (type, name = null, onConfirm = null) => {
    set({ isOpen: true, type, name, onConfirm });
  },
  
  closeGreeting: () => {
    set({ isOpen: false, type: null, name: null, onConfirm: null });
  }
}));

export default useGreetingStore;
