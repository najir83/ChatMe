"use client";
/// Mobile Sidebar with full functionality

import { useState } from "react";
import { motion } from "motion/react";
import { EllipsisVertical, X } from "lucide-react";
import { toast, Bounce } from "react-toastify";
import useStore from "@/lib/store";

export default function SidebarMob() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    User,
    Chats,
    selectedChat,
    setSelectedChat,
    setHistory,
    present,
    setPresent,
  } = useStore();

  // Handle selecting a chat
  const handleSelectedChat = async (i) => {
    setPresent(false);

    const url = `/api/generate/${Chats[i]._id}`;
    try {
      const res = await fetch(url);
      const data = await res.json();

      setHistory(data.history);
      setSelectedChat(Chats.length - 1 - i);
    } catch (err) {
      toast.error("Fetching Problem !!", {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  return (
    <>
      {/* Sidebar */}
      <motion.div
        animate={{ x: [-250, isOpen ? 0 : -450], opacity: [0, 1] }}
        // initial={{ x: -250 }}
        // animate={{ x: isOpen ? 0 : -450 }}

        transition={{ type: "", stiffness: 100 }}
        className="fixed top-0 left-0 h-screen w-100 bg-gradient-to-b from-gray-900 via-black to-gray-900 shadow-xl z-40 md:static md:translate-x-0 md:flex md:flex-col"
      >
        {/* Header */}
        <div>
          <div className="w-full flex justify-between px-4 py-4 lg:py-5">
            <i className="fa-solid lg:text-sm text-gray-400 hover:text-cyan-400 fa-magnifying-glass"></i>
            <X onClick={() => setIsOpen(false)} size={20} />
          </div>

          {/* Action items */}
          <div className="h-[80vh] px-4 py-2 flex flex-col gap-4 text-gray-200 text-sm">
            {/* New Chat */}
            <div
              onClick={() => {
                setHistory([]);
                setSelectedChat(-1);
                setPresent(false);
                setIsOpen(false);
              }}
              className="flex items-center gap-4 cursor-pointer hover:bg-gray-800/60 p-2 rounded-xl transition"
            >
              <i className="fa-regular text-gray-400 text-lg fa-pen-to-square"></i>
              <h1 className="hover:text-purple-400">New Chat</h1>
            </div>

            {/* History */}
            <div className="rounded-xl">
              <div className="flex items-center gap-4 cursor-pointer px-2 p-2 bg-purple-600/30 border border-purple-500/40 rounded-xl transition">
                <i className="fa-solid text-cyan-400 text-lg fa-clock-rotate-left"></i>
                <h1 className="text-purple-400 font-medium">History</h1>
              </div>

              <div className="bg-gray-800/40 pb-3 text-lg pt-1 pl-6 pr-2 text-left rounded-b-xl">
                {Chats.slice()
                  .reverse()
                  .map((e, i) => (
                    <div
                      onClick={() => {
                        setIsOpen(false);
                        handleSelectedChat(Chats.length - 1 - i);
                      }}
                      key={i}
                      className={`py-1 hover:bg-gray-700/60 px-3 flex my-1 w-full h-10 whitespace-nowrap overflow-hidden cursor-pointer rounded-xl transition ${
                        selectedChat === i && "text-green-400 bg-gray-700/60"
                      }`}
                    >
                      <p className="text-gray-300 hover:text-green-400">
                        {e.title}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quota placeholder */}
        <div className="text-gray-400 px-5 py-4 text-xs border-t border-gray-800">
          <div className="flex gap-3 items-center">
            <i className="fa-solid fa-gauge text-sm text-purple-400"></i>
            <div>
              <p className="text-sm">
                chat limit:{" "}
                <strong className="text-cyan-400">{User?.used_query}</strong> /{" "}
                <span className="text-gray-300">{User?.query_limit}</span>
              </p>
              <div className="w-full bg-gray-800 rounded h-2 mt-1">
                <div
                  className="bg-gradient-to-r from-purple-500 to-cyan-400 h-2 rounded"
                  style={{
                    width: `${
                      (User?.used_query * 100) / (User?.query_limit | 1)
                    }%`,
                  }}
                ></div>
              </div>
            </div>
            {User?.role === "premium" && (
              <p
                onClick={() => {
                  toast.success("🦄 You are a premium user", {
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                  });
                }}
                className="px-4 cursor-pointer py-2 rounded-xl text-white font-semibold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 shadow-lg"
              >
                Pro
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Mobile Toggle Button */}
      {!isOpen && (
        <button
          className="fixed top-4 left-98 z-50 md:hidden p-2 rounded-lg text-gray-300 hover:text-purple-400"
          onClick={() => setIsOpen(!isOpen)}
        >
          <EllipsisVertical size={24} />
        </button>
      )}
    </>
  );
}
