import { create } from "zustand";

// Function to safely get the theme from localStorage
const getStoredTheme = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("chat-theme") || "coffee";
  }
  return "coffee"; // Default theme if localStorage is not available
};

export const useThemeStore = create((set) => ({
  theme: getStoredTheme(),
  setTheme: (theme) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("chat-theme", theme);
      document.documentElement.setAttribute("data-theme", theme); // Apply globally
    }
    set({ theme });
  },
}));
