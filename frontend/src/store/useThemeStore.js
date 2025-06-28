import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("LANGBRIDGE-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("LANGBRIDGE-theme", theme);
    set({ theme });
  },
}));