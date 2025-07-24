"use client";
import Link from "next/link";
import React from "react";

export default function Page() {
  return (
    <div className="min-h-screen   text-gray-800 dark:text-gray-200 px-6 py-12 lg:w-[70vw] mx-auto">
      <Link href="/"
        className={`fa-solid absolute top-4  lg:right-88 lg:hover:text-4xl lg:top-7 lg:text-3xl text-xl cursor-pointer text-white font-bold fa-arrow-left`}
      ></Link >
      <h1 className="lg:text-4xl text-2xl font-bold mb-6">About ChatMe</h1>

      <p className="mb-2 lg:mb-6 text-lg">
        <strong>
          Welcome to ChatMe – Your AI-powered Conversation Partner
        </strong>
      </p>

      <p className="lg:mb-6 mb-2">
        ChatMe is an intelligent AI assistant built to help you explore, learn,
        create, and communicate like never before. Whether you're seeking quick
        answers, writing assistance, code explanations, or deep conversations on
        any topic — ChatMe is here for you, 24/7.
      </p>

      <h2 className="lg:text-2xl text-xl font-semibold mt-10 mb-4">
        ✨ What ChatMe Can Do:
      </h2>
      <ul className="list-disc list-inside space-y-2">
        <li>
          <strong>Answer Your Questions:</strong> From science and tech to
          history, health, or pop culture — just ask!
        </li>
        <li>
          <strong>Write & Create:</strong> Need help writing an email, poem,
          story, blog post, or resume? ChatMe's got your back.
        </li>
        <li>
          <strong>Learn & Understand:</strong> Break down tough topics, get
          step-by-step solutions, or study smarter.
        </li>
        <li>
          <strong>Code Smarter:</strong> Debug errors, explain code, or even
          write scripts in Python, JavaScript, and more.
        </li>
        <li>
          <strong>Converse Freely:</strong> Have meaningful chats, practice
          languages, or just explore ideas.
        </li>
      </ul>

      <h2 className="lg:text-2xl text-xl font-semibold mt-10 mb-4">🚀 Why ChatMe?</h2>
      <p className="mb-6">
        Unlike static tools,{" "}
        <strong>ChatMe is conversational and dynamic</strong> — designed to
        adapt to your style and intent. Inspired by models like Google’s Gemini
        and OpenAI’s ChatGPT, ChatMe offers:
      </p>
      <ul className="list-disc list-inside space-y-2">
        <li>💬 Natural language interaction</li>
        <li>🧠 Intelligent, context-aware responses</li>
        <li>🛠️ Productivity-focused tools</li>
        <li>🔐 Privacy-first conversations (your chats stay with you)</li>
      </ul>

      <h2 className="lg:text-2xl text-xl font-semibold lg:mt-10 mt-4 mb-4">
        👨‍💻 Built By Developers, For Everyone
      </h2>
      <p className="mb-6">
        ChatMe was crafted with cutting-edge AI technologies, using modern
        full-stack tools to deliver fast, responsive, and user-friendly
        experiences. Whether you're a developer, student, creator, or curious
        mind — ChatMe is designed to be your everyday AI companion.
      </p>

      <h2 className="lg:text-2xl text-xl font-semibold mt-10 mb-4">🌐 Get Started</h2>
      <p>
        Start chatting, learning, building, and discovering.{" "}
        <strong>ChatMe is your gateway to the power of AI</strong> — in a way
        that's simple, secure, and always available.
      </p>
    </div>
  );
}
