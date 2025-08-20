"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
// Helper component for checkmark icon
import useStore from "@/lib/store";
import { X } from "lucide-react";
const CheckIcon = () => (
  <svg
    className="w-5 h-5 text-violet-400"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

// Feature list item component
const FeatureListItem = ({ children }) => (
  <li className="flex items-start space-x-3">
    <div className="flex-shrink-0 pt-1">
      <CheckIcon />
    </div>
    <span>{children}</span>
  </li>
);

// Pricing Card Component
const PricingCard = ({
  plan,
  price,
  features,
  isFeatured = false,
  variants,
}) => {
  const { setShowCard } = useStore();
  const go = useRouter();
  const cardClasses = `
        bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 flex flex-col h-full relative
        ${isFeatured ? "glow-border" : ""}
    `;
  const buttonClasses = `
        w-full mt-auto font-semibold py-3 px-6 rounded-lg transition-colors duration-300
        ${
          isFeatured
            ? "bg-violet-600 hover:bg-violet-700 text-white"
            : "bg-gray-700 hover:bg-gray-600 text-white"
        }
    `;

  return (
    <motion.div variants={variants} className={cardClasses}>
      {isFeatured && (
        <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
          <span className="bg-violet-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase">
            Most Popular
          </span>
        </div>
      )}
      <h3 className="text-2xl font-bold">{plan}</h3>
      <p className="mt-4 text-gray-400">{price.description}</p>
      <div className="my-8">
        <span className="text-5xl font-extrabold">{price.amount}</span>
        <span className="text-gray-400 text-lg ml-1">{price.period}</span>
      </div>
      <ul className="space-y-4 text-gray-300">
        {features.map((feature, index) => (
          <FeatureListItem key={index}>{feature}</FeatureListItem>
        ))}
      </ul>
      <motion.button
        onClick={() => {
          if (plan === "Free") go.push("/chat");
          else {
            setShowCard(true);
          }
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={buttonClasses}
      >
        {plan === "Free" ? "Get Started" : "Choose Plan"}
      </motion.button>
    </motion.div>
  );
};

import Lottie from "lottie-react";
import animationData from "@/public/PaymentSuccessful.json";
import { toast, Bounce } from "react-toastify";
import { useEffect } from "react";
// Main App Component
export default function App() {
  const goo = useRouter();
  const [isYearly, setIsYearly] = useState(false);
  const { showPayCard, setShowCard, User, setUser } = useStore();

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const freePlan = {
    plan: "Free",
    price: {
      amount: "$0",
      period: "/month",
      description: "For basic conversations and trying out the platform.",
    },
    features: [
      "Access to standard AI model",
      "10 messages per day",
      "Standard response speed",
      "Community support",
    ],
  };

  const proPlan = {
    plan: "Pro",
    price: {
      amount: isYearly ? "$150" : "$20",
      period: isYearly ? "/year" : "/month",
      description: "For power users who need the best of Gemini Chat.",
    },
    features: [
      "Access to advanced AI models (Gemini Pro)",
      "Unlimited messages",
      "Priority access to new features",
      "Faster response times",
      "Advanced context and memory",
      "Dedicated email support",
    ],
  };
  const [showSuccessful, setShowSuccessful] = useState(false);
  const handleUpdate = async () => {
    setShowSuccessful(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerk_id: User?.clerk_id }),
      });

      const { user } = await res.json();
      setUser(user);

      // Redirect after 2 seconds (once)
      setTimeout(() => {
        setShowSuccessful(false);
        setShowCard(false);
        goo.push("/");
      }, 2000);
    } catch (e) {
      toast.error("Internal server error", {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      setShowSuccessful(false);
    }
  };
  useEffect(() => {
    //   console.log(User?.role);
    if (User?.role === "premium") {
      goo.push("/");
    }
  }, [User]);

  return showSuccessful ? (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900  flex items-center justify-center">
      <Lottie
        animationData={animationData}
        // loop={true}
        className="w-140 h-140"
      />
    </div>
  ) : (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white antialiased min-h-screen">
      {/* Header */}

      <header className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <svg
              className="h-8 w-8 text-violet-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
            <h1 className="text-2xl font-bold">Gemini Chat</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="hover:text-violet-400 transition-colors">
              Features
            </a>
            <a href="#" className="hover:text-violet-400 transition-colors">
              Pricing
            </a>
            <a href="#" className="hover:text-violet-400 transition-colors">
              Contact
            </a>
          </nav>
          <button className="bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            Sign In
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main
        className={`container mx-auto px-6 py-16 md:py-24 ${
          showPayCard && "bg-gray-800  pointer-events-none"
        }`}
      >
        {showPayCard && (
          <div className="fixed bg-gray-900/70 backdrop-blur-md pointer-events-auto border opacity-100 border-gray-500 rounded-2xl shadow-2xl flex flex-col items-center text-white py-10 px-18 p-6 z-40  left-5 top-40 lg:left-200">
            {/* Title */}
            <div
              onClick={() => setShowCard(false)}
              className="absolute top-4 right-4"
            >
              <X />
            </div>

            <h2 className="text-2xl font-semibold mb-2">Subscription Plan</h2>

            {/* Price */}
            <h1 className="text-5xl font-bold mb-4">
              ${isYearly ? 150 : 20}
              <span className="text-lg font-normal text-gray-400">
                {isYearly ? "/year" : "/month"}
              </span>
            </h1>

            {/* Features */}
            <ul className="space-y-2 text-gray-300 text-sm mb-6">
              <li>✔ Unlimited access to all features</li>
              <li>✔ Priority support</li>
              <li>✔ Cancel anytime</li>
            </ul>

            {/* Pay Button */}
            <button
              onClick={handleUpdate}
              className="bg-green-500 hover:bg-green-700 transition-colors px-6 py-3 rounded-xl font-semibold text-white w-full"
            >
              Pay Now
            </button>
          </div>
        )}

        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-purple-500">
            Unlock Your Potential
          </h2>
          <p className="mt-6 text-lg md:text-xl text-gray-300">
            Choose the plan that's right for you. Start for free or upgrade to
            Pro for unlimited access to our most powerful AI.
          </p>
        </motion.div>

        {/* Pricing Toggle */}
        <motion.div
          className="flex items-center justify-center mt-12 space-x-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span
            className={`font-medium ${
              !isYearly ? "text-white" : "text-gray-400"
            }`}
          >
            Monthly
          </span>
          <label className="relative inline-block w-14 h-8">
            <input
              type="checkbox"
              className="opacity-0 w-0 h-0 peer"
              checked={isYearly}
              onChange={() => setIsYearly(!isYearly)}
            />
            <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-700 rounded-full transition-colors duration-300 before:absolute before:content-[''] before:h-6 before:w-6 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-transform before:duration-300 peer-checked:bg-violet-600 peer-checked:before:translate-x-6"></span>
          </label>
          <span
            className={`font-medium ${
              isYearly ? "text-white" : "text-gray-400"
            }`}
          >
            Yearly <span className="text-violet-400 text-sm">(Save 25%)</span>
          </span>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <PricingCard {...freePlan} variants={itemVariants} />
          <PricingCard {...proPlan} isFeatured={true} variants={itemVariants} />
        </motion.div>
      </main>

      {/* Footer */}

      {/* Adding the glow-border style definition for React */}
      <style jsx global>{`
        .glow-border {
          box-shadow: 0 0 15px 2px rgba(139, 92, 246, 0.6),
            0 0 5px 1px rgba(139, 92, 246, 0.4);
        }
      `}</style>
    </div>
  );
}
