"use client";

// Official SOS Wheel Colors (Verified)
const wheelColors = [
  { name: "Family Support", color: "#F26522" },      // Orange
  { name: "Positive Friends", color: "#FFC20E" },   // Yellow
  { name: "Mentors", color: "#39B54A" },             // Green
  { name: "Healthy Activities", color: "#29ABE2" }, // Blue
  { name: "Generosity", color: "#808080" },          // Gray
  { name: "Spirituality", color: "#92278F" },        // Purple
  { name: "Physical Health", color: "#87CEEB" },    // Light Blue
  { name: "Mental Health", color: "#ED1C24" },      // Red
];

interface SOSWheelLogoProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

export function SOSWheelLogo({
  size = 40,
  className = "",
}: SOSWheelLogoProps) {
  const segmentAngle = 360 / 8;
  const radius = size / 2;
  const innerRadius = radius * 0.3;

  // Create SVG path for each segment
  const createSegmentPath = (index: number) => {
    const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);

    const x1 = radius + innerRadius * Math.cos(startAngle);
    const y1 = radius + innerRadius * Math.sin(startAngle);
    const x2 = radius + radius * Math.cos(startAngle);
    const y2 = radius + radius * Math.sin(startAngle);
    const x3 = radius + radius * Math.cos(endAngle);
    const y3 = radius + radius * Math.sin(endAngle);
    const x4 = radius + innerRadius * Math.cos(endAngle);
    const y4 = radius + innerRadius * Math.sin(endAngle);

    return `M ${x1} ${y1} L ${x2} ${y2} A ${radius} ${radius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1}`;
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`transition-transform duration-300 hover:rotate-[15deg] hover:scale-110 ${className}`}
    >
      {wheelColors.map((segment, index) => (
        <path
          key={segment.name}
          d={createSegmentPath(index)}
          fill={segment.color}
        />
      ))}
      {/* Center circle */}
      <circle
        cx={radius}
        cy={radius}
        r={innerRadius * 0.7}
        fill="var(--background, #0A0A0B)"
      />
    </svg>
  );
}

// Gradient text that uses all 8 colors
export function SOSGradientText({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: `linear-gradient(90deg, ${wheelColors.map((c) => c.color).join(", ")})`,
      }}
    >
      {children}
    </span>
  );
}

// 8-color gradient border
export function SOSGradientBorder({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-2xl p-[2px] ${className}`}
      style={{
        background: `linear-gradient(90deg, ${wheelColors.map((c) => c.color).join(", ")})`,
      }}
    >
      <div className="rounded-2xl bg-[var(--background)] h-full">{children}</div>
    </div>
  );
}
