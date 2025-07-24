"use client";
import Main from "@/components/Main";
import { toast, Bounce } from "react-toastify";
import { Changa } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import useStore from "@/lib/store";
import { useUser } from "@clerk/nextjs";
import useIsMobile from "@/hooks/useIsMobile";
export default function Home() {
  const isMobile = useIsMobile();
  const { isSignedIn, user, isLoaded } = useUser();
  const [wid, setWid] = useState(3);
  useEffect(() => {
    if (isMobile) setWid(7);
  }, [isMobile]);
  const [xbar, setXbar] = useState("arrow-right");
  const {
    excedLimit,
    setLimit,
    totLimit,
    useLimit,
    setUseLimit,
    loadLimit,
    chat_id,
    setChatId,
    selectedChat,
    setSelectedChat,
  } = useStore();
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const loadHistory = async (chk = 1) => {
    if (showHistory && chk) {
      setShowHistory(false);
      return;
    }
    const load = async () => {
      const res = await fetch(`/api/history/${user.id}`);
      const data = await res.json();
      // console.log(data.chat_history);
      let _history = data.chat_history;
      _history.reverse();
      setHistory(_history);
    };
    if (!user) {
      toast.warn("Please login", {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } else load();
    setShowHistory(true);
  };

  const handleCreateChat = async () => {
    // alert(user.id)
    // return;
    if (!user) {
      window.location.reload();
    } else {
      try {
        const res = await fetch(`/api/history/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            auth_id: user.id,
            title: "Enter your thoughts...",
          }),
        });
        setSelectedChat(0);
        const data = await res.json();
        // console.log(data);
        setChatId(data.chat_id);
        loadHistory(0);
      } catch (e) {
        console.log(e.message);
        toast.error("Try again", {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    }
  };
  const change = () => {
    if (xbar == "arrow-right") {
      setXbar("arrow-left");
      setWid(isMobile ? 100 : 17);
    } else {
      setXbar("arrow-right");
      setWid(isMobile ? 7 : 3);
    }
  };
  useEffect(() => {
    const Load = async () => {
      loadLimit(user?.id);
    };
    Load();
  }, [user]);

  // alert(isMobile)
  return (
    <div className="flex  text-gray-500">
      {/* dash-bord  */}
      <div
        onMouseEnter={() => {
          if (xbar == "arrow-right") change();
        }}
        onMouseLeave={() => {
          if (xbar == "arrow-left") change();
        }}
        style={{ width: `${wid}%` }}
        className={`transition-all ${
          isMobile ? "absolute z-10" : ""
        }   duration-500 min-h-screen flex flex-col justify-between bg-[#222327]`}
      >
        {/* Top controls */}
        <div>
          <div className="w-full flex justify-between lg:px-5 px-2 py-4 lg:py-5">
            <button
              onClick={change}
              className={`fa-solid lg:text-lg text-lg cursor-pointer text-gray-500 fa-${xbar}`}
            ></button>
            <i
              hidden={xbar == "arrow-right"}
              className="fa-solid lg:text-sm text-gray-500 fa-magnifying-glass"
            ></i>
          </div>

          {/* Action items */}
          <div className="h-[80vh] lg:px-5  py-2 flex flex-col lg:gap-6 gap-3 text-gray-300 text-sm">
            {/* New Chat */}
            <div
              className="flex items-center gap-4 cursor-pointer hover:bg-[#2e2f31] lg:p-2 p-2 py-2 rounded-xl"
              onClick={handleCreateChat} // Optional logic to reset chat
            >
              <i className="fa-regular text-gray-500 text-lg fa-pen-to-square"></i>
              <h1 hidden={xbar === "arrow-right"}>New Chat</h1>
            </div>

            {/* History Placeholder */}
            <div className="  rounded-xl">
              <div
                onClick={loadHistory}
                className={`flex items-center gap-4 cursor-pointer lg:px-2 p-2 py-2 ${
                  showHistory ? "bg-[#2e2f31]" : ""
                }  hover:bg-[#2e2f31]`}
              >
                <i className="fa-solid text-gray-500 text-lg  fa-clock-rotate-left"></i>
                <h1 hidden={xbar === "arrow-right"}>History</h1>
              </div>
              {showHistory && xbar === "arrow-left" && (
                <div className="  bg-[#2e2f31] pb-3 text-lg pt-1 pl-6 pr-2 text-left">
                  {history.map((e, i) => {
                    return (
                      <div
                        key={i}
                        onClick={() => {
                          setSelectedChat(i);
                          setChatId(e._id);
                        }}
                        className={`py-1 ${
                          selectedChat == i ? "bg-gray-700" : ""
                        } hover:bg-gray-700 px-3  flex my-1  w-full h-10  whitespace-nowrap  overflow-hidden  cursor-pointer rounded-2xl`}
                      >
                        <p>{e?.title}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quota section */}
        {(!isMobile || xbar === "arrow-left") && (
          <div className="text-gray-400 lg:px-5 lg:py-4 p-1 py-2  text-xs border-t border-gray-600">
            <div className="flex gap-3 items-center">
              <i className="fa-solid fa-gauge text-sm"></i>
              <div className="my-10" hidden={xbar === "arrow-right"}>
                <p className="text-lg">
                  Chat used: <strong>{useLimit}</strong> / {totLimit}
                </p>
                <div className="w-full bg-gray-700 rounded h-2 mt-1">
                  <div
                    className="bg-blue-400 h-1 rounded"
                    style={{ width: `${(useLimit / totLimit) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Main />
    </div>
  );
}
