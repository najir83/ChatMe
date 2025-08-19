"use client";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import useIsMobile from "@/hooks/useIsMobile";
import useStore from "@/lib/store";
import { toast, Bounce } from "react-toastify";
import { SignedIn, UserButton, SignedOut, SignOutButton } from "@clerk/nextjs";
import { OrbitProgress } from "react-loading-indicators";

import Lottie from "lottie-react";
import animationData from "@/public/Spinner.json";
import dott from "@/public/bott.json";
// OrbitProgress

export default function Main() {
  const template = useRef();

  const isMobile = useIsMobile();
  const {
    history,
    selectedChat,
    setHistory,
    User,
    Chats,
    setChats,
    setSelectedChat,
    present,
    setPresent,
    setUser,
  } = useStore();

  useEffect(() => {
    
  }, []);
  const [generating, setGenerating] = useState(false);
  const [chat, setChat] = useState("");
  const [messages, setMessages] = useState("");

  const sumary = (s) => {
    let p = "";
    let c = 0;
    for (let i = 0; i < Math.min(s.length, 12); i++) {
      if (s[i] === " ") c++;
      if (c >= 4) break;
      p = p + s[i];
    }
    return p;
  };
  const generate = async () => {
    if (User?.used_query === User?.query_limit) {
      toast.warn("You have exced your chat limit !!", { theme: "dark" });
      return;
    }
    if (generating) return;
    if (chat.trim().length <= 0) {
      toast.warn("Enter something !!", { theme: "dark" });
      return;
    }

    

    setGenerating(true);

    let chatId;

    if (selectedChat === -1) {
      const summary = sumary(chat);
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerk_id: User.clerk_id, title: summary }),
      });
      const { chat_id } = await res.json();

      chatId = chat_id; // ✅ store it
      setChats([...Chats, { _id: chat_id, title: summary }]);
      setSelectedChat(0);
    } else {
      // ✅ use existing one
      chatId = Chats[Chats.length - 1 - selectedChat]?._id;
    }

    if (!chatId) {
      toast.error("Chat ID missing!", { theme: "dark" });
      setGenerating(false);
      
      return;
    }

    const msg = [...history];
    if (messages) {
      msg.push({
        role: "model",
        parts: [{ text: messages }],
      });
    }
    msg.push({ role: "user", parts: [{ text: chat }] });
    setHistory(msg);
    setMessages("");

    const Res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId, // ✅ safe to use
        role: "user",
        parts: [{ text: chat }],
      }),
    });

    if (!Res.ok) {
      toast.error("Error while updating data !!", { theme: "dark" });
      setGenerating(false);
      
      return;
    }

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history: msg }),
    });
    const data = await res.json();

    const Res2 = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId, // ✅ again safe
        role: "model",
        parts: [{ text: data.message }],
      }),
    });

    if (!Res2.ok) {
      toast.error("Error while updating data !!", { theme: "dark" });
      setGenerating(false);
      
      return;
    }

    const Res3 = await fetch("/api/update-limit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clerk_id: User?.clerk_id,
      }),
    });
    const data2 = await Res3.json();
    if (!Res3.ok) {
      toast.error(data?.message || "Error while updating data !!", {
        theme: "dark",
      });
      setGenerating(false);
      
      return;
    } else {
      setUser(data2.user);
    }
    msg.push({
      role: "model",
      parts: [{ text: data.message }],
    });
    setChat("");
    setHistory(msg);
    setGenerating(false);
  };

  // 🔥 FIX: scroll when history OR messages update
  useEffect(() => {
    template.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, messages, generating]);

  const inputRef = useRef();

  return (
    <div className="flex flex-col w-full h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
        >
          <Link href="/">Zyra</Link>
        </motion.div>
        <div className="flex items-center gap-4">
          <Link
            href="/subscription"
            className="px-5 py-2 rounded-xl font-medium transition border border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black hover:scale-105 shadow-md"
          >
            Sub{!isMobile && "scription"}
          </Link>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {history.length === 0 && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="mt-30 text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg"
              >
                Welcome to <span className="animate-pulse">Zyra</span>
                <br />
                <span className="text-2xl md:text-3xl font-semibold">
                  Your Personal Assistant
                </span>
              </motion.div>
              {/* Dummy Search content */}
              <div className="flex flex-wrap gap-6 justify-center items-center mt-10">
                <motion.div
                  onClick={() => {
                    setChat("What is the current weather of Kolkata ? ");
                    inputRef.current.focus();
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className={`shadow-lg shadow-gray-800/50 cursor-pointer border border-gray-700 px-4 py-4 w-60 rounded-2xl  text-center text-gray-100`}
                >
                  <h2 className="text-lg font-semibold">
                    🌤️ Current Weather of
                  </h2>
                  <p className="mt-1 text-sm opacity-80">Kolkata</p>
                </motion.div>
                <motion.div
                  onClick={() => {
                    setChat("Tell me some latest news about AI in 2025 . ");
                    inputRef.current.focus();
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className={`shadow-lg shadow-gray-800/50 cursor-pointer border border-gray-700 px-4 py-4 w-60 rounded-2xl  text-center text-gray-100`}
                >
                  <h2 className="text-lg font-semibold">📰 Latest News</h2>
                  <p className="mt-1 text-sm opacity-80">AI in 2025</p>
                </motion.div>
                <motion.div
                  onClick={() => {
                    setChat("Give me some Sci-Fi movie suggestions . ");
                    inputRef.current.focus();
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className={`shadow-lg shadow-gray-800/50 border border-gray-700 px-4 py-4 w-60 rounded-2xl  text-center text-gray-100`}
                >
                  <h2 className="text-lg font-semibold">🎬 Movie Suggestion</h2>
                  <p className="mt-1 text-sm opacity-80">Sci-Fi</p>
                </motion.div>
              </div>
            </>
          )}

          {history.map((e, i) =>
            e.role === "user" ? (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="flex justify-end"
              >
                <div className="max-w-[70%] p-4 rounded-l-4xl rounded-tr-4xl bg-gray-800/50 text-white">
                  {e.parts[0].text}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-start space-x-3"
              >
                <i className="fa-solid fa-star mt-4 text-blue-400"></i>
                <div className="bg-gray-800/50 rounded-2xl px-4 py-3">
                  <ReactMarkdown>{e.parts[0].text}</ReactMarkdown>
                </div>
              </motion.div>
            )
          )}

          {generating && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-start space-x-3"
            >
              <i className="fa-solid fa-star mt-4 text-blue-400"></i>

              <div
                className={`bg-gray-800/50 min-w-[40vw] ${
                  generating && "animate-pulse"
                } rounded-2xl px-4 py-3 relative`}
              >
                {!messages ? (
                  <div className="w-full h-5 bg-gray-700 rounded animate-pulse relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                    />
                  </div>
                ) : (
                  <ReactMarkdown>{messages}</ReactMarkdown>
                )}
              </div>
            </motion.div>
          )}

          <div ref={template} className="pb-10" />
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-gray-800 flex items-center gap-3">
          <input
            ref={inputRef}
            value={chat}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                generate();
              }
            }}
            onChange={(e) => {
              setChat(e.target.value);
            }}
            className="flex-1 px-4 py-3 rounded-3xl bg-gray-800/60 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter your thoughts..."
          />
          <button
            onClick={generate}
            className="p-3 rounded-full  cursor-pointer bg-purple-500 hover:bg-purple-600 transition"
          >
            {!generating ? (
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                className="text-white"
                height="1.3em"
                width="1.3em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M48 448l416-192L48 64v149.333L346 256 48 298.667z"></path>
              </svg>
            ) : (
              <div className="w-7 h-7  flex items-center justify-center">
                <Lottie
                  animationData={animationData}
                  loop={true}
                  className="w-10 h-10"
                />
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
