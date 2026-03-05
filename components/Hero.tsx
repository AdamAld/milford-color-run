"use client";

import { useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown, MapPin, Clock, Calendar } from "lucide-react";
import { CountdownTimer } from "./CountdownTimer";
import { SOSWheelLogo } from "./SOSWheelLogo";
import { HeroMapPreview } from "./HeroMapPreview";
import { track } from "@/lib/analytics";

function HeroMapWithParams({ scrollToRoute }: { scrollToRoute: () => void }) {
  const searchParams = useSearchParams();
  const variant = searchParams.get("heroMap") === "leaflet" ? "leaflet" as const : "runner" as const;
  return <HeroMapPreview variant={variant} onScrollToRoute={scrollToRoute} />;
}

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
        <Suspense fallback={<HeroMapPreview variant="runner" onScrollToRoute={scrollToRoute} />}>
          <HeroMapWithParams scrollToRoute={scrollToRoute} />
        </Suspense>

        {/* Countdown Timer */}
        <div className="mb-10 animate-fade-in animation-delay-1000">
          <CountdownTimer />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in animation-delay-1200">
          <button
            onClick={() => {
              track("cta_clicked", { location: "hero" });
              scrollToRegister();
            }}
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
