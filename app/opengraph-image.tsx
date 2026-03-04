import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Milford Sources of Strength Color Run 5K - May 2, 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0A0A0B 0%, #1a1a2e 50%, #16213e 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Color splash circles */}
        <div style={{ position: "absolute", top: -40, left: -40, width: 200, height: 200, borderRadius: "50%", background: "#F26522", opacity: 0.3, display: "flex" }} />
        <div style={{ position: "absolute", top: 80, right: -30, width: 160, height: 160, borderRadius: "50%", background: "#FFC20E", opacity: 0.25, display: "flex" }} />
        <div style={{ position: "absolute", bottom: -50, left: 100, width: 180, height: 180, borderRadius: "50%", background: "#39B54A", opacity: 0.25, display: "flex" }} />
        <div style={{ position: "absolute", bottom: 40, right: 80, width: 140, height: 140, borderRadius: "50%", background: "#29ABE2", opacity: 0.3, display: "flex" }} />
        <div style={{ position: "absolute", top: 200, left: 200, width: 120, height: 120, borderRadius: "50%", background: "#92278F", opacity: 0.2, display: "flex" }} />
        <div style={{ position: "absolute", bottom: 180, right: 300, width: 100, height: 100, borderRadius: "50%", background: "#ED1C24", opacity: 0.2, display: "flex" }} />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            padding: "40px 60px",
            textAlign: "center",
          }}
        >
          {/* Event type badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,0.1)",
              borderRadius: 40,
              padding: "8px 24px",
              marginBottom: 24,
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <span style={{ fontSize: 18, color: "#29ABE2", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" as const }}>
              Color Run 5K
            </span>
          </div>

          {/* Main title */}
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#FFFFFF" }}>Milford</span>
            <span
              style={{
                background: "linear-gradient(90deg, #F26522, #FFC20E, #39B54A, #29ABE2, #92278F)",
                backgroundClip: "text",
                color: "transparent",
                WebkitBackgroundClip: "text",
              }}
            >
              Sources of Strength
            </span>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 24,
              color: "rgba(255,255,255,0.7)",
              marginTop: 20,
              display: "flex",
            }}
          >
            Run for strength, celebrate in color!
          </div>

          {/* Date & Location */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              marginTop: 32,
              fontSize: 20,
              color: "#FFFFFF",
              fontWeight: 600,
            }}
          >
            <span>May 2, 2026</span>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>|</span>
            <span>10:00 AM</span>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>|</span>
            <span>Miami Meadows Park</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
