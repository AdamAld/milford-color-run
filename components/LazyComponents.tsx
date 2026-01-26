"use client";

import dynamic from "next/dynamic";

// Lazy load heavy components that aren't needed for initial render
export const ParticleBackground = dynamic(
  () => import("@/components/ParticleBackground").then((mod) => ({ default: mod.ParticleBackground })),
  { ssr: false }
);

export const RouteMap = dynamic(
  () => import("@/components/RouteMap").then((mod) => ({ default: mod.RouteMap })),
  {
    ssr: false,
    loading: () => (
      <section id="route" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-[var(--sos-teal)] uppercase tracking-wider">
              The Course
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mt-2">
              5K Route at <span className="text-[var(--sos-teal)]">Miami Meadows</span>
            </h2>
          </div>
          <div className="h-[500px] rounded-2xl bg-[var(--background-secondary)] animate-pulse flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-[var(--sos-teal)] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-[var(--foreground-muted)]">Loading map...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }
);
