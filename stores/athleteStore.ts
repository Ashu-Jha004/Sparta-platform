import { create } from "zustand";

interface AthleteState {
  name: string;
  age: string;
  sport: string;
  profileImage: File | null;
  setField: (field: string, value: string | File | null) => void;
  reset: () => void;
}

export const useAthleteStore = create<AthleteState>((set) => ({
  name: "",
  age: "",
  sport: "",
  profileImage: null,
  setField: (field, value) => set({ [field]: value } as Partial<AthleteState>),
  reset: () => set({ name: "", age: "", sport: "", profileImage: null }),
}));
