"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ChevronDown, MapPin, Clock, Calendar } from "lucide-react";
import { CountdownTimer } from "./CountdownTimer";
import { SOSWheelLogo } from "./SOSWheelLogo";

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;

    // Animate title letters on load
    const letters = titleRef.current.querySelectorAll(".letter");
    gsap.fromTo(
      letters,
      { opacity: 0, y: 50, rotateX: -90 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        stagger: 0.03,
        ease: "back.out(1.7)",
        delay: 0.5,
      }
    );
  }, []);

  const scrollToAbout = () => {
    const aboutSection = document.querySelector("#about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToRegister = () => {
    const registerSection = document.querySelector("#register");
    if (registerSection) {
      registerSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToRoute = () => {
    const routeSection = document.querySelector("#route");
    if (routeSection) {
      routeSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Split text into animated letters
  const animateText = (text: string, className?: string) => {
    return text.split("").map((char, index) => (
      <span
        key={index}
        className={`letter inline-block ${className || ""}`}
        style={{ display: char === " " ? "inline" : "inline-block" }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 overflow-hidden"
    >
      {/* Background gradient blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-[var(--color-pink)] opacity-20 blur-[100px]"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-[var(--sos-teal)] opacity-20 blur-[100px]"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-[var(--sos-purple)] opacity-20 blur-[100px]"
          animate={{
            x: [0, 30, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--color-yellow)] opacity-10 blur-[150px]"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl">
        {/* Main Title */}
        <h1
          ref={titleRef}
          className="text-4xl md:text-6xl lg:text-8xl font-bold mb-4 text-shadow"
        >
          <span className="block text-white">
            {animateText("COLOR RUN")}
          </span>
          {/* 5K with strong visibility */}
          <span className="block mt-4 relative">
            {/* Multiple glow layers for stronger effect */}
            <span
              className="absolute inset-0 text-6xl md:text-8xl lg:text-9xl font-black text-white blur-2xl opacity-40"
              aria-hidden="true"
            >
              5K
            </span>
            <span
              className="absolute inset-0 text-6xl md:text-8xl lg:text-9xl font-black text-[#29ABE2] blur-xl opacity-50"
              aria-hidden="true"
            >
              5K
            </span>
            {/* Main text - solid white with colored stroke effect */}
            <span
              className="relative text-6xl md:text-8xl lg:text-9xl font-black text-white"
              style={{
                textShadow: `
                  0 0 10px #F26522,
                  0 0 20px #FFC20E,
                  0 0 30px #39B54A,
                  0 0 40px #29ABE2,
                  0 0 50px #92278F,
                  2px 2px 0 #F26522,
                  -2px -2px 0 #29ABE2
                `,
              }}
            >
              {animateText("5K")}
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-lg md:text-xl text-[var(--foreground-muted)] mb-8 max-w-2xl mx-auto"
        >
          Run for strength. Celebrate in color.
        </motion.p>

        {/* Event Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8"
        >
          {/* Date */}
          <div className="glass rounded-xl px-5 py-3 flex items-center gap-3">
            <Calendar size={20} className="text-[var(--sos-teal)]" />
            <div className="text-left">
              <span className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider">Date</span>
              <span className="text-white font-bold">May 2, 2026</span>
            </div>
          </div>

          {/* Time */}
          <div className="glass rounded-xl px-5 py-3 flex items-center gap-3">
            <Clock size={20} className="text-[var(--color-yellow)]" />
            <div className="text-left">
              <span className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider">Schedule</span>
              <span className="text-white font-bold">9 AM Registration • 10 AM Start</span>
            </div>
          </div>

          {/* Location */}
          <div className="glass rounded-xl px-5 py-3 flex items-center gap-3">
            <MapPin size={20} className="text-[var(--color-pink)]" />
            <div className="text-left">
              <span className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider">Location</span>
              <span className="text-white font-bold">Miami Meadows Park</span>
            </div>
          </div>
        </motion.div>

        {/* Mini Map Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="mb-8"
        >
          <button
            onClick={scrollToRoute}
            className="group relative inline-block"
          >
            <div className="glass rounded-2xl p-3 overflow-hidden transition-all duration-300 group-hover:scale-105">
              <div className="relative w-64 h-40 md:w-80 md:h-48 rounded-xl overflow-hidden bg-[var(--background-tertiary)]">
                {/* SVG Route Preview */}
                <svg
                  viewBox="0 0 200 120"
                  className="w-full h-full"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Background grid pattern */}
                  <defs>
                    <pattern id="heroGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
                    </pattern>
                    <linearGradient id="heroRouteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F26522" />
                      <stop offset="25%" stopColor="#FFC20E" />
                      <stop offset="50%" stopColor="#39B54A" />
                      <stop offset="75%" stopColor="#29ABE2" />
                      <stop offset="100%" stopColor="#92278F" />
                    </linearGradient>
                  </defs>
                  <rect width="200" height="120" fill="url(#heroGrid)" />

                  {/* Simplified route path */}
                  <motion.path
                    d="M 140 60 Q 120 30 80 35 Q 40 40 35 60 Q 30 80 50 90 Q 80 100 110 85 Q 130 75 140 60"
                    fill="none"
                    stroke="url(#heroRouteGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: 1.8, ease: "easeInOut" }}
                  />

                  {/* Glow effect */}
                  <path
                    d="M 140 60 Q 120 30 80 35 Q 40 40 35 60 Q 30 80 50 90 Q 80 100 110 85 Q 130 75 140 60"
                    fill="none"
                    stroke="url(#heroRouteGradient)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.3"
                    filter="blur(4px)"
                  />

                  {/* Start/Finish marker */}
                  <motion.circle
                    cx="140"
                    cy="60"
                    r="6"
                    fill="#39B54A"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 3.8 }}
                  />
                  <motion.circle
                    cx="140"
                    cy="60"
                    r="10"
                    fill="none"
                    stroke="#39B54A"
                    strokeWidth="2"
                    opacity="0.5"
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ delay: 3.8, duration: 2, repeat: Infinity }}
                  />

                  {/* Color station markers */}
                  {[
                    { x: 80, y: 35, color: "#F26522" },
                    { x: 45, y: 55, color: "#FFC20E" },
                    { x: 40, y: 80, color: "#39B54A" },
                    { x: 70, y: 95, color: "#29ABE2" },
                    { x: 105, y: 82, color: "#92278F" },
                  ].map((station, i) => (
                    <motion.circle
                      key={i}
                      cx={station.x}
                      cy={station.y}
                      r="4"
                      fill={station.color}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 2 + i * 0.2 }}
                    />
                  ))}
                </svg>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Label */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-white text-sm font-semibold">View Course Map</span>
                  <span className="text-[var(--sos-blue)] text-xs">3.1 miles • 8 stations</span>
                </div>
              </div>
            </div>
            {/* Glow effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-[var(--sos-blue)] to-[var(--sos-purple)] rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity -z-10" />
          </button>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="mb-10"
        >
          <CountdownTimer />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            onClick={scrollToRegister}
            className="gradient-button px-8 py-4 rounded-full text-lg font-semibold text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Register Now</span>
          </motion.button>
          <motion.button
            onClick={scrollToAbout}
            className="glass px-8 py-4 rounded-full text-lg font-semibold text-white hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.button>
        </motion.div>

        {/* Sources of Strength Attribution - 8-Color Wheel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2 }}
          className="mt-10 flex items-center justify-center gap-3"
        >
          <span className="text-xs text-[var(--foreground-muted)]">Presented by</span>
          <div className="flex items-center gap-2">
            <SOSWheelLogo size={24} animate />
            <span className="text-sm text-white font-medium">Milford High School Sources of Strength</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        onClick={scrollToAbout}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[var(--foreground-muted)] hover:text-white transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { delay: 2.5, duration: 0.5 },
          y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <ChevronDown size={32} />
      </motion.button>
    </section>
  );
}
