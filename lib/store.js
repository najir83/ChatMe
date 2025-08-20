import { create } from "zustand";

const useStore = create((set, get) => ({
  selectedChat: -1,
  history: [],
  User: null,
  Chats: [],
  clerk_id: 123,
  name: "Sk Najir",
  present: false,
  showPayCard: false,

  setShowCard: (i) => {
    set({ showPayCard: i });
  },
  setPresent: (i) => {
    set({ present: i });
  },
  setSelectedChat: (i) => {
    set({ selectedChat: i });
  },
  setHistory: (i) => {
    set({ history: i });
  },
  setChats: (e) => {
    set({ Chats: e });
  },
  setUser: (u) => {
    set({ User: u });
  },
}));

export default useStore;
