"use client";

import { useRef } from "react";
import { ChevronDown, MapPin, Clock, Calendar } from "lucide-react";
import { CountdownTimer } from "./CountdownTimer";
import { SOSWheelLogo } from "./SOSWheelLogo";

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);

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

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 overflow-hidden"
    >
      {/* Background gradient blobs - CSS only for performance */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-[var(--color-pink)] opacity-20 blur-[100px] animate-blob" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-[var(--sos-teal)] opacity-20 blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-[var(--sos-purple)] opacity-20 blur-[100px] animate-blob animation-delay-4000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--color-yellow)] opacity-10 blur-[150px] animate-pulse-slow" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl animate-fade-in">
        {/* Main Title */}
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-4 text-shadow">
          <span className="block text-white animate-slide-up">COLOR RUN</span>
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
              className="relative text-6xl md:text-8xl lg:text-9xl font-black text-white animate-slide-up animation-delay-200"
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
              5K
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-[var(--foreground-muted)] mb-8 max-w-2xl mx-auto animate-fade-in animation-delay-400">
          Run for strength. Celebrate in color.
        </p>

        {/* Event Info Cards */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8 animate-fade-in animation-delay-600">
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
        </div>

        {/* Mini Map Preview */}
        <div className="mb-8 animate-fade-in animation-delay-800">
          <button
            onClick={scrollToRoute}
            className="group relative inline-block"
          >
            <div className="glass rounded-2xl p-3 overflow-hidden transition-all duration-300 group-hover:scale-105">
              <div className="relative w-64 h-40 md:w-80 md:h-48 rounded-xl overflow-hidden bg-[var(--background-tertiary)]">
                {/* SVG Route Preview - static for performance */}
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

                  {/* Route path */}
                  <path
                    d="M 140 60 Q 120 30 80 35 Q 40 40 35 60 Q 30 80 50 90 Q 80 100 110 85 Q 130 75 140 60"
                    fill="none"
                    stroke="url(#heroRouteGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-draw-path"
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
                  <circle cx="140" cy="60" r="6" fill="#39B54A" />
                  <circle
                    cx="140"
                    cy="60"
                    r="10"
                    fill="none"
                    stroke="#39B54A"
                    strokeWidth="2"
                    opacity="0.5"
                    className="animate-ping-slow"
                  />

                  {/* Color station markers */}
                  <circle cx="80" cy="35" r="4" fill="#F26522" />
                  <circle cx="45" cy="55" r="4" fill="#FFC20E" />
                  <circle cx="40" cy="80" r="4" fill="#39B54A" />
                  <circle cx="70" cy="95" r="4" fill="#29ABE2" />
                  <circle cx="105" cy="82" r="4" fill="#92278F" />
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
        </div>

        {/* Countdown Timer */}
        <div className="mb-10 animate-fade-in animation-delay-1000">
          <CountdownTimer />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in animation-delay-1200">
          <button
            onClick={scrollToRegister}
            className="gradient-button px-8 py-4 rounded-full text-lg font-semibold text-white hover:scale-105 active:scale-95 transition-transform"
          >
            <span>Register Now</span>
          </button>
          <button
            onClick={scrollToAbout}
            className="glass px-8 py-4 rounded-full text-lg font-semibold text-white hover:bg-white/10 hover:scale-105 active:scale-95 transition-all"
          >
            Learn More
          </button>
        </div>

        {/* Sources of Strength Attribution - 8-Color Wheel */}
        <div className="mt-10 flex items-center justify-center gap-3 animate-fade-in animation-delay-1400">
          <span className="text-xs text-[var(--foreground-muted)]">Presented by</span>
          <div className="flex items-center gap-2">
            <SOSWheelLogo size={24} />
            <span className="text-sm text-white font-medium">Milford High School Sources of Strength</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[var(--foreground-muted)] hover:text-white transition-colors animate-bounce-slow animation-delay-2000"
      >
        <ChevronDown size={32} />
      </button>
    </section>
  );
}
