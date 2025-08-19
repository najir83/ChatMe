"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex flex-col items-center justify-center px-6">
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl lg:text-7xl font-bold text-center"
      >
        Meet <span className="text-blue-400">Zyra</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="mt-6 text-lg lg:text-2xl text-gray-300 text-center max-w-2xl"
      >
        Your AI assistant for smarter conversations. Powered by fast responses, 
        beautiful design, and seamless experience.
      </motion.p>

      {/* Main CTAs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-10 flex gap-6 flex-wrap justify-center"
      >
        <Link
          href="/features"
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold shadow-lg transition"
        >
          Explore Features
        </Link>
        <Link
          href="/about"
          className="px-6 py-3 border border-gray-400 hover:bg-gray-800 rounded-xl font-semibold transition"
        >
          Learn More
        </Link>
      </motion.div>

      
    </div>
  );
}
