"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const features = [
  {
    title: "Real-time Conversations",
    desc: "Experience lightning-fast AI chat powered by advanced models.",
    icon: "💬",
  },
  {
    title: "Smart Memory",
    desc: "Seamlessly continue your chats with persistent history.",
    icon: "🧠",
  },
  {
    title: "Internet Access",
    desc: "Automatically connect with external tools and make real-time web calls.",
    icon: "⚡",
  },
];

export default function Features() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-16">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl lg:text-6xl font-bold mb-12 mt-12 lg:mt-0 text-center"
      >
        Powerful <span className="text-blue-400">Features</span>
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: i * 0.2 }}
            viewport={{ once: true }}
            className="bg-gray-900 p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform"
          >
            <div className="text-5xl mb-4">{f.icon}</div>
            <h2 className="text-xl font-semibold mb-2">{f.title}</h2>
            <p className="text-gray-400">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      <Link
        href="/about"
        className="mt-12 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold shadow-lg transition"
      >
        About Us →
      </Link>
    </div>
  );
}
