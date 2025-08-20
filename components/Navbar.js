"use client";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  SignOutButton,
  useUser,
} from "@clerk/nextjs";
import { useEffect } from "react";
import useStore from "@/lib/store";
import { toast } from "react-toastify";
import { Bounce } from "react-toastify";

export default function Navbar() {
  const { user, isLoaded } = useUser();

  // console.log(user);
  const [isOpen, setIsOpen] = useState(false);
  const { clerk_id, name, User, setUser, setPresent } = useStore();

  const pathName = usePathname();
  // if (pathName != "/chat") {
  //   setPresent(false);
  // }
  // useEffect(() => {
  //   setPresent(false);
  // }, []);
  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user?.fullName,
          clerk_id: user?.id,
        }),
      });
      if (!res.ok) {
        toast.error("Faceing Problem , Try again", {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        console.log(res);
      } else {
        const data = await res.json();
        // alert(data);
        // console.log(data);
        setUser(data.user);
      }
    };
    if (isLoaded && user) load();
  }, [isLoaded]);

  if (pathName == "/chat") return <></>;

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-gradient-to-r from-gray-900 via-black to-gray-900 backdrop-blur-lg shadow-lg">
      <div className="max-w-8xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
        >
          Zyra
        </motion.div>

        {/* Middle Menu (Desktop Only) */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="hover:text-blue-400 transition">
            Home
          </Link>
          <Link href="/chat" className="hover:text-blue-400 transition">
            Chat
          </Link>
          <Link href="/features" className="hover:text-blue-400 transition">
            Features
          </Link>
          <Link href="/about" className="hover:text-blue-400 transition">
            About
          </Link>
        </div>

        {/* Right Side (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {User?.role === "user" && (
            <Link
              href="/subscription"
              className="px-5 py-2 rounded-xl font-medium transition border border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black hover:scale-105 shadow-md"
            >
              Subscription
            </Link>
          )}
          <SignedOut>
            <SignInButton className="px-5 py-2 rounded-xl font-medium transition bg-gray-800/60 hover:bg-gray-700/70 hover:scale-105 shadow-sm">
              Login
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>

        {/* Mobile Right Side - Subscription always visible */}
        <div className="md:hidden flex items-center gap-2">
          {User?.role === "user" && (
            <Link
              href="/subscription"
              className="px-4 py-2 rounded-lg font-medium transition border border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black shadow-md"
            >
              Sub
            </Link>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none text-white"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-gray-900/95 backdrop-blur-lg px-6 py-4 flex flex-col gap-4"
        >
          <Link
            href="/"
            className="px-5 py-2 rounded-xl font-medium hover:bg-gray-800/70 text-center transition"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/chat"
            className="px-5 py-2 rounded-xl font-medium hover:bg-gray-800/70 text-center transition"
            onClick={() => setIsOpen(false)}
          >
            Chat
          </Link>
          <Link
            href="/features"
            className="px-5 py-2 rounded-xl font-medium hover:bg-gray-800/70 text-center transition"
            onClick={() => setIsOpen(false)}
          >
            Features
          </Link>
          <Link
            href="/about"
            className="px-5 py-2 rounded-xl font-medium hover:bg-gray-800/70 text-center transition"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <SignedOut>
            <SignInButton className="px-5 py-2 rounded-xl font-medium transition bg-gray-800/60 hover:bg-gray-700/70 hover:scale-105 shadow-sm">
              Login
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <SignOutButton className="px-5 py-2 rounded-xl font-medium transition bg-red-950 hover:scale-105 shadow-sm">
              Logout
            </SignOutButton>
          </SignedIn>
        </motion.div>
      )}
    </nav>
  );
}
