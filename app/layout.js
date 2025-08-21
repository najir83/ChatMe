import { Geist, Geist_Mono,Poppins, Roboto } from "next/font/google";
import "./globals.css";
import { ToastContainer, Bounce } from "react-toastify";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins", // optional for CSS variable
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Zyra - Your personal AI Agent based assistant",
  description: "This is Zyra home page to generate assistant",
  icons: {
    icon: "/chatme2.png", // or "/favicon.png" if you're using PNG
  },
};

export default function RootLayout({ children }) {





  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <script
            src="https://kit.fontawesome.com/ece4b86e58.js"
            crossOrigin="anonymous"
          ></script>
          
        </head>

        <body
          className={`${poppins.variable} ${roboto.variable} bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white  antialiased`}
        >
          <ToastContainer
            position="top-right"
            autoClose={2500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
          />
          {/* Same as */}
          <Navbar/>
          <ToastContainer />

          {children}
          <Footer/>
        </body>
      </html>
    </ClerkProvider>
  );
}
