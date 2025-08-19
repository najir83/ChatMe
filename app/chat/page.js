"use client";
import Sidebar from "@/components/Sidebar";
import Main from "@/components/Main";
import { useEffect, useState } from "react";
import useIsMobile from "@/hooks/useIsMobile";
import SidebarMob from "@/components/SidebarMod";
import useStore from "@/lib/store";
import { OrbitProgress } from "react-loading-indicators";
export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isMobile = useIsMobile();

  const {  User, setUser, Chats, setChats } = useStore();

  
  useEffect(() => {
    const loadChats = async () => {
      const res = await fetch(`/api/chats/${User?.clerk_id}`);
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
      } else {
        const data = await res.json();
        // console.log(data);
        setChats(data.chats);
      }
    };
    if (User) {
      loadChats();
    }
    // console.log("User",User);
  }, [User]);

  // console.log(Chats);
  return !isClient ? (
    <div className="flex min-h-screen bg-black justify-center items-center ">
      <OrbitProgress variant="disc" color="#32cd32" size="medium" text="" textColor="" />
    </div>
  ) : (
    <div className="flex min-h-screen bg-black text-gray-300">
      {/* Sidebar */}
      {isMobile ? <SidebarMob /> : <Sidebar />}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Main />
      </div>
    </div>
  );
}
