"use client";

import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { Sparkle } from "lucide-react";
import { TypingAnimation } from "@/components/typing-animation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

// Background SVG Component
const BackgroundElements = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Animated Lines */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Diagonal flowing lines */}
        <motion.path
          d="M0,20 Q25,15 50,25 T100,20"
          stroke="rgba(147, 51, 234, 0.1)"
          strokeWidth="0.5"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3, delay: 0.5, ease: "easeInOut" }}
        />
        <motion.path
          d="M0,40 Q30,35 60,45 T100,40"
          stroke="rgba(147, 51, 234, 0.08)"
          strokeWidth="0.3"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 4, delay: 1, ease: "easeInOut" }}
        />
        <motion.path
          d="M0,70 Q40,65 70,75 T100,70"
          stroke="rgba(147, 51, 234, 0.06)"
          strokeWidth="0.4"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 5, delay: 1.5, ease: "easeInOut" }}
        />

        {/* Vertical flowing lines */}
        <motion.path
          d="M15,0 Q20,25 15,50 T15,100"
          stroke="rgba(147, 51, 234, 0.05)"
          strokeWidth="0.3"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 6, delay: 2, ease: "easeInOut" }}
        />
        <motion.path
          d="M85,0 Q80,30 85,60 T85,100"
          stroke="rgba(147, 51, 234, 0.04)"
          strokeWidth="0.2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 7, delay: 2.5, ease: "easeInOut" }}
        />
      </svg>

      {/* Floating Dots */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-purple-400/20"
          style={{
            left: `${15 + i * 12}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 4,
            delay: i * 0.3,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Subtle Grid Pattern */}
      <motion.div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(147, 51, 234, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.02 }}
        transition={{ duration: 2, delay: 3 }}
      />
    </div>
  );
};

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-tl from-background to-purple-300 p-6">
      <BackgroundElements />

      <motion.div
        className="relative z-10 flex w-full max-w-sm flex-col items-center space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Logo with enhanced animations */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{
            duration: 1.2,
            delay: 0.2,
            type: "spring",
            stiffness: 100,
            damping: 10,
          }}
        >
          <motion.div
            className="flex h-16 w-16 cursor-pointer items-center justify-center transition-transform duration-200 hover:scale-110 active:scale-95"
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <Sparkle className="h-8 w-8 text-black drop-shadow-sm" />
            </motion.div>
          </motion.div>

          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-purple-400/20 blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Main Heading with staggered animation */}
        <motion.div
          className="space-y-2 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <TypingAnimation />
          <motion.p
            className="text-lg text-black"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            with Eve.
          </motion.p>
        </motion.div>

        {/* Spacer */}
        <div className="min-h-[3vh] flex-1"></div>

        {/* Enhanced Get Started Button */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="transition-transform duration-200 hover:-translate-y-0.5"
        >
          <Link href="/sign-in">
            <motion.div
              whileTap={{ scale: 0.98 }}
              className="transition-transform duration-200 hover:scale-105"
            >
              <Button
                className="w-40 border-none bg-white/70 text-base font-normal text-gray-700 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:opacity-100 hover:shadow-xl"
                variant="ghost"
              >
                Get Started
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>

      {/* Enhanced bottom logo */}
      <motion.div
        className="absolute bottom-0 cursor-pointer py-10 transition-transform duration-300 hover:-translate-y-1 hover:scale-105"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <Image
          src="logo.svg"
          alt="Logo"
          width={96}
          height={96}
          className="drop-shadow-sm"
        />
      </motion.div>

      {/* Subtle particle effects */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute h-0.5 w-0.5 rounded-full bg-purple-300/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            delay: Math.random() * 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
