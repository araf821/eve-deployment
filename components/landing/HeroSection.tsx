"use client";

import { Button } from "@/components/ui/button";
import { Sparkle } from "lucide-react";
import { TypingAnimation } from "@/components/typing-animation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";

export function HeroSection() {
  return (
    <motion.div
      className="relative z-10 flex w-full max-w-md flex-col items-center space-y-8"
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
        <div className="flex h-20 w-20 items-center justify-center">
          <Image
            src="/logo.svg"
            alt="Eve Logo"
            width={64}
            height={64}
            className="drop-shadow-sm"
          />
        </div>

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
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
          className="text-lg text-foreground/80"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          with Eve.
        </motion.p>
      </motion.div>

      {/* Enhanced Get Started Button */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        <Link href="/sign-in">
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg"
          >
            Get Started
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
