"use client";
import useIsMobile from "@/hooks/useIsMobile";
import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Footer() {
  const isMobile = useIsMobile();
    const pathName = usePathname();
    if (pathName == "/chat") return null;
  
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-black flex justify-between lg:px-6 px-3   to-gray-900 text-gray-300 py-4 items-center">
      {/* <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6"> */}

      {/* Branding */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
      >
        Zyra
      </motion.div>
      <div className="text-center text-gray-500 text-sm mt-2 lg:mt-6">
        © {new Date().getFullYear()} Zyra. All rights reserved.
      </div>

      {/* Social Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center gap-6"
      >
        <Link
          href="https://github.com/"
          target="_blank"
          className="flex items-center gap-1 lg:gap-2  px-2 py-1 md:px-4 md:py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition shadow-md"
        >
          <Github size={isMobile ? 15:20} />
        </Link>
        <Link
          href="https://linkedin.com/"
          target="_blank"
          className="flex items-center gap-1 lg:gap-2 px-2 py-1 md:px-4 md:py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition shadow-md"
        >
          <Linkedin size={isMobile ? 15:20} />
        </Link>
      </motion.div>
      {/* </div> */}

      {/* Bottom */}
    </footer>
  );
}
