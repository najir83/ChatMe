"use client";

import { ToastContainer, toast, Bounce } from "react-toastify";
import useIsMobile from "@/hooks/useIsMobile";
import useStore from "@/lib/store";
import { useState, useEffect } from "react";
export default function Sidebar() {
  const isMobile = useIsMobile();
  const {
    User,
    Chats,
    selectedChat,
    setSelectedChat,
    setHistory,
    present,
    setPresent,
  } = useStore();
  const [low, setLow] = useState(isMobile ? 0 : 4);
  const [high, setHigh] = useState(isMobile ? 20 : 17);
  const [w, setW] = useState(false);

  // console.log(Chats);
  const handleSelectedChat = async (i) => {
    // alert(i);
    setPresent(false);

    const url = `/api/generate/${Chats[i]._id}`;
    try {
      const res = await fetch(url);

      const data = await res.json();
      // console.log("Response:", data.history);
      setHistory(data.history);
      setSelectedChat(Chats.length - 1 - i);
    } catch (err) {
      const data = await res.json();

      toast.error(data?.message || "Feceing Problem !!", {
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
      // console.error("Error:", err);
    }
  };
  // console.log(User);

  return (
    <div
      onClick={() => {
        if (!w) setW(true);
      }}
      style={{ width: `${!w ? low : high}%` }}
      className={`${
        isMobile && "absolute z-50"
      } transition-all duration-500 min-h-screen flex flex-col justify-between bg-gradient-to-br from-gray-900 via-black to-gray-900`}
    >
      {/* Top controls */}
      <div>
        <div className="w-full flex justify-between lg:px-5 px-2 py-4 lg:py-5">
          <button
            onClick={() => setW(!w)}
            className={`fa-solid text-lg cursor-pointer text-gray-400 hover:text-purple-400 fa-arrow-${
              !w ? "right pl-2 " : "left"
            }`}
          ></button>
          {w && (
            <i className="fa-solid lg:text-sm text-gray-400 hover:text-cyan-400 fa-magnifying-glass"></i>
          )}
        </div>

        {/* Action items */}
        <div className="h-[80vh] lg:px-5 py-2 flex flex-col lg:gap-6 gap-3 text-gray-200 text-sm">
          {/* New Chat */}
          <div
            onClick={() => {
              setHistory([]);
              setSelectedChat(-1);
              setPresent(false);
            }}
            className="flex items-center gap-4 cursor-pointer hover:bg-gray-800/60 lg:p-2 p-2 rounded-xl transition"
          >
            <i className="fa-regular text-gray-400 text-lg fa-pen-to-square"></i>
            {w && <h1 className="hover:text-purple-400">New Chat</h1>}
          </div>

          {/* History */}
          <div className="rounded-xl">
            <div className="flex items-center gap-4 cursor-pointer lg:px-2 p-2 bg-purple-600/30 border border-purple-500/40 rounded-xl transition">
              <i className="fa-solid text-cyan-400 text-lg fa-clock-rotate-left"></i>
              {w && <h1 className="text-purple-400 font-medium">History</h1>}
            </div>

            {w && (
              <div className="bg-gray-800/40 pb-3 text-lg pt-1 pl-6 pr-2 text-left rounded-b-xl">
                {Chats.slice()
                  .reverse()
                  .map((e, i) => {
                    // console.log(e);
                    return (
                      <div
                        onClick={() => handleSelectedChat(Chats.length - 1 - i)}
                        key={i}
                        className={`py-1 hover:bg-gray-700/60 px-3 flex my-1 w-full h-10 whitespace-nowrap overflow-hidden cursor-pointer rounded-xl transition ${
                          selectedChat == i && "text-green-400 bg-gray-700/60"
                        }`}
                      >
                        <p className={`"text-gray-300 hover:text-green-400 `}>
                          {e.title}
                        </p>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quota placeholder */}
      <div className="text-gray-400 lg:px-5 lg:py-4 p-1 py-2 text-xs border-t border-gray-800">
        <div className="flex gap-3 items-center">
          <i className="fa-solid fa-gauge text-sm text-purple-400"></i>
          <div>
            {w && (
              <p className="text-sm">
                chat limit :{" "}
                <strong className="text-cyan-400">{User?.used_query}</strong> /{" "}
                <span className="text-gray-300">{User?.query_limit}</span>
              </p>
            )}
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
          {w && User?.role === "premium" && (
            <p
              onClick={() => {
                toast.success("🦄 You are an premium user", {
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
                // alert("You are an premium user");
              }}
              className="px-4 cursor-pointer py-2 rounded-xl text-white font-semibold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 shadow-lg"
            >
              Pro
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
