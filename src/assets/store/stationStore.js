import { create } from "zustand";

export const useStationStore = create((set) => ({
  availableStations: [],
  selectedStation: null,
  setAvailableStations: (stations) => set({ availableStations: stations }),
  setSelectedStation: (station) => set({ selectedStation: station }),
}));
