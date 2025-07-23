"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import useStore from "@/lib/store";

export default function Main() {
  const [chatMessage, setChatMessage] = useState("");
  const [chat, setChat] = useState("");
  const [isResponding, setIsResponding] = useState(false);
  const [history, setHistory] = useState([]);
  const bottomRef = useRef(null);

  const { excedLimit, totLimit, useLimit, setUseLimit, chat_id } = useStore();

  useEffect(() => {
    const getHistory = async () => {
      const res = await fetch(`api/generate/${chat_id}`);
      const data = await res.json();
      // console.log(data);
      setHistory(data.history);
    };
    if (chat_id) {
      getHistory();
    }
  }, [chat_id]);

  const send = async () => {
    if (useLimit === totLimit) {
      alert(`Your Message limit is exced`);
      return;
    }
    if (history.length == 0) {
      // alert("calls")
      const response = await fetch("api/updatechat", {
        method: "POST",
        body: JSON.stringify({ chat_id, title: chat }),
        headers: { "Content-Type": "application/json" },
      });
    }
    if (isResponding || chat.trim() === "") return;
    setIsResponding(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ chat, history }),
      headers: { "Content-Type": "application/json" },
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let result = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      result += decoder.decode(value);
      setChatMessage(result);
    }

    setChatMessage("");
    setHistory([
      ...history,
      { role: "user", parts: [{ text: chat }] },
      { role: "model", parts: [{ text: `${result}` }] },
    ]);
    const res = await fetch(`api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id,
        role: "user",
        parts: [{ text: chat }],
      }),
    });
    const res2 = await fetch(`api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id,
        role: "model",
        parts: [{ text: `${result}` }],
      }),
    });
    setUseLimit(useLimit + 1);
    setIsResponding(false);
    setChat("");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, chatMessage, isResponding]);

  return (
    <div className="w-full mx-auto text-gray-300 px-4">
      <div className="h-[8vh] flex justify-between">
        <div className="p-2">
          <h1 className="lg:text-xl">ChatMe</h1>
          <button className="bg-[#222327] px-3 rounded-2xl">2.5 Flash</button>
        </div>
        <div className="p-2 flex gap-3 justify-center items-center">
          <Link href="/about" className="hover:bg-gray-700 p-2 rounded-2xl">
            About ChatMe
          </Link>
          {/* <Link
            className="bg-blue-400 hover:bg-blue-600 rounded-lg px-6 text-black py-2"
            href="/"
          >
            Sign in
          </Link> */}
          <SignedOut>
            <SignInButton>
              <button className="  font-bold px-3 py-1 rounded-2xl  bg-blue-400 hover:bg-blue-600 text-black cursor-pointer">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton>
              <button className=" px-3 py-1 rounded-2xl font-bold  bg-blue-400 hover:bg-blue-600 text-black cursor-pointer">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>

      <div className="w-full relative text-center h-[92vh]">
        {history.length === 0 && !isResponding && (
          <div className="  lg:text-4xl absolute lg:top-70 lg:left-170 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 text-4xl font-bold">
            <h1>Meet ChatMe,</h1>
            <h2>your personal AI assistant</h2>
          </div>
        )}

        <div className="w-full ">
          <div className="lg:h-[78vh] w-[60vw] mx-auto  pb-40 overflow-auto ">
            {history.map((e, i) => {
              if (e.role === "user") {
                return (
                  <div key={i} className="w-full flex justify-end my-3">
                    <div className="w-[50%] text-left p-4 rounded-l-4xl rounded-r-2xl bg-[#37393b] text-white lg:text-lg">
                      {e.parts[0].text}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div
                    key={i}
                    className="my-6 flex text-white lg:text-lg text-left p-4"
                  >
                    <i className="fa-solid fa-star mt-1 px-3 text-blue-400"></i>
                    <div>
                      <ReactMarkdown>{e?.parts?.[0]?.text}</ReactMarkdown>
                    </div>
                  </div>
                );
              }
            })}

            {/* Typing bubble */}
            {isResponding && (
              <>
                <div className="w-full flex justify-end my-3">
                  <div className="w-[50%] animate-pulse text-left p-4 rounded-l-4xl rounded-r-2xl bg-[#37393b] text-white lg:text-lg">
                    {chat}
                  </div>
                </div>
                <div className="my-6 flex text-white lg:text-lg text-left p-4">
                  <i className="fa-solid fa-star mt-1 px-3 text-blue-400"></i>
                  <div>
                    <ReactMarkdown>{String(chatMessage || "")}</ReactMarkdown>
                  </div>
                </div>
              </>
            )}

            <div ref={bottomRef}></div>
          </div>
        </div>

        {/* Input */}
        <input
          value={chat}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          onChange={(e) => {
            setChat(e.target.value);
          }}
          className="text-gray-400 border-1 w-[40vw] lg:text-lg py-4 lg:px-8 lg:pr-17 rounded-4xl lg:bottom-15 lg:left-125 absolute"
          placeholder="Enter your thoughts"
        />

        <button
          disabled={isResponding}
         
          onClick={send}
          className={` text-xl  flex justify-center items-center absolute cursor-pointer text-white  ${
            !isResponding
              ? "lg:bottom-12 lg:left-299 py-3 lg:px-3 "
              : "lg:bottom-12 lg:left-299 py-3 lg:px-4"
          } rounded-full m-4`}
        >
        { !isResponding &&(chat.length > 0) && <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 512 512"
            class="text-2xl cursor-pointer"
            height="1.2em"
            width="1.2em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M48 448l416-192L48 64v149.333L346 256 48 298.667z"></path>
          </svg>}
          {isResponding && (
            <svg
              class="w-7 h-7     animate-spin text-blue-50"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          )}
        </button>

        {/* <button
  disabled
  class="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-md opacity-80 cursor-not-allowed"
>
  
  Preprocessing...
</button> */}
      </div>
    </div>
  );
}
