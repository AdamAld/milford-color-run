"use client";

import dynamic from "next/dynamic";

const SOS_COLORS = [
  "#F26522", "#FFC20E", "#39B54A", "#29ABE2",
  "#808080", "#92278F", "#87CEEB", "#ED1C24",
];

// Lazy-load the real Leaflet map for the snapshot variant
const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[var(--background-tertiary)] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-[var(--sos-teal)] border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

/* ------------------------------------------------------------------ */
/*  Component 1: RunnerTrailPreview                                    */
/* ------------------------------------------------------------------ */
function RunnerTrailPreview() {
  // A gentle wave path the runner follows
  const wavePath =
    "M 10,60 C 40,20 70,90 100,50 C 130,10 160,80 190,40";

  // Positions along the wave where splats sit (roughly evenly spaced)
  const splatPositions = [
    { x: 20, y: 52 },
    { x: 45, y: 30 },
    { x: 70, y: 72 },
    { x: 95, y: 50 },
    { x: 118, y: 22 },
    { x: 140, y: 60 },
    { x: 162, y: 70 },
    { x: 185, y: 42 },
  ];

  return (
    <svg
      viewBox="0 0 200 100"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Background grid */}
      <defs>
        <pattern
          id="previewGrid"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="200" height="100" fill="url(#previewGrid)" />

      {/* Faint trail line */}
      <path
        d={wavePath}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Color splats — each pops as runner passes */}
      {splatPositions.map((pos, i) => (
        <circle
          key={i}
          cx={pos.x}
          cy={pos.y}
          r="0"
          fill={SOS_COLORS[i]}
          className="splat-circle"
          style={{
            // Each splat fires when the runner reaches its position
            animationDelay: `${(i / 8) * 4}s`,
          }}
        />
      ))}

      {/* Runner dot — moves along the wave path */}
      <circle
        r="4"
        fill="white"
        className="hero-runner-dot"
        filter="url(#runnerGlow)"
      />

      {/* Glow filter for the runner dot */}
      <defs>
        <filter id="runnerGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Component 2: LeafletSnapshotPreview                                */
/* ------------------------------------------------------------------ */
function LeafletSnapshotPreview() {
  return (
    <div className="relative w-full h-full">
      <div className="w-full h-full pointer-events-none">
        <LeafletMap selectedPOI={null} onPOISelect={() => {}} />
      </div>
      {/* Dark gradient overlay for label readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30 pointer-events-none" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared Wrapper                                                     */
/* ------------------------------------------------------------------ */
interface HeroMapPreviewProps {
  variant: "runner" | "leaflet";
  onScrollToRoute: () => void;
}

export function HeroMapPreview({ variant, onScrollToRoute }: HeroMapPreviewProps) {
  return (
    <div className="mb-8 animate-fade-in animation-delay-800">
      <button
        onClick={onScrollToRoute}
        className="group relative inline-block"
      >
        <div className="glass rounded-2xl p-3 overflow-hidden transition-all duration-300 group-hover:scale-105">
          <div className="relative w-64 h-40 md:w-80 md:h-48 rounded-xl overflow-hidden bg-[var(--background-tertiary)]">
            {variant === "runner" ? (
              <RunnerTrailPreview />
            ) : (
              <LeafletSnapshotPreview />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            {/* Label */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="text-white text-sm font-semibold">
                View Course Map
              </span>
              <span className="text-[var(--sos-blue)] text-xs">
                3.1 miles &bull; 8 stations
              </span>
            </div>
          </div>
        </div>
        {/* Glow effect */}
        <div className="absolute -inset-2 bg-gradient-to-r from-[var(--sos-blue)] to-[var(--sos-purple)] rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity -z-10" />
      </button>
    </div>
  );
}
