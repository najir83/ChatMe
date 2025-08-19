"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white flex flex-col items-center justify-center px-6">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-5xl lg:text-7xl font-bold text-center"
      >
        About <span className="text-blue-400">Zyra</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="mt-6 text-lg lg:text-2xl text-gray-300 text-center max-w-3xl"
      >
        Zyra was built to make conversations with AI simple, beautiful, and 
        effective. With cutting-edge models, smooth animations, and intuitive design,
        it redefines how you interact with AI.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-10 flex gap-6"
      >
        <Link
          href="/"
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold shadow-lg transition"
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
