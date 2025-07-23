import { create } from "zustand";

const DEFAULT_TOT_LIMIT = 33;
const DEFAULT_USE_LIMIT = 0;

const getToday = () => new Date().toISOString().split("T")[0];

const useStore = create((set, get) => ({
  excedLimit: false,
  totLimit: 0,
  useLimit: 0,
  chat_id: null,
  selectedChat: -1,

  setSelectedChat: (i) => {
    set({ selectedChat: i });
  },
  setChatId: (id) => {
    set({ chat_id: id });
  },

  setLimit: (flag) => {
    set({ excedLimit: flag });
  },

  setUseLimit: (value, id = null) => {
    const today = getToday();
    set({ useLimit: value });

    if (id === null) {
      const current = JSON.parse(localStorage.getItem("limits") || "{}");
      const updated = {
        ...current,
        useLimit: value,
        date: today,
      };
      localStorage.setItem("limits", JSON.stringify(updated));
    }
  },

  setTotLimit: (value, id = null) => {
    const today = getToday();
    set({ totLimit: value });

    if (id === null) {
      const current = JSON.parse(localStorage.getItem("limits") || "{}");
      const updated = {
        ...current,
        totLimit: value,
        date: today,
      };
      localStorage.setItem("limits", JSON.stringify(updated));
    }
  },

  loadLimit: (id = null) => {
    if (typeof window === "undefined") return; // SSR check
    const today = getToday();

    if (id === null) {
      const stored = localStorage.getItem("limits");
      if (stored) {
        const { totLimit, useLimit, date } = JSON.parse(stored);

        if (date === today) {
          set({
            totLimit: totLimit ?? DEFAULT_TOT_LIMIT,
            useLimit: useLimit ?? DEFAULT_USE_LIMIT,
          });
        } else {
          // Old date – reset
          const reset = {
            totLimit: DEFAULT_TOT_LIMIT,
            useLimit: DEFAULT_USE_LIMIT,
            date: today,
          };
          localStorage.setItem("limits", JSON.stringify(reset));
          set({ totLimit: DEFAULT_TOT_LIMIT, useLimit: DEFAULT_USE_LIMIT });
        }
      } else {
        // First time usage
        const initial = {
          totLimit: DEFAULT_TOT_LIMIT,
          useLimit: DEFAULT_USE_LIMIT,
          date: today,
        };
        localStorage.setItem("limits", JSON.stringify(initial));
        set({ totLimit: DEFAULT_TOT_LIMIT, useLimit: DEFAULT_USE_LIMIT });
      }
    } else {
      // Authenticated user (default values, can be fetched from DB later)
    }
  },
}));

export default useStore;
