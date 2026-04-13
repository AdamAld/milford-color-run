import QRCode from "qrcode";
import { writeFileSync } from "fs";
import { join } from "path";
import sharp from "sharp";

// ── CLI Configuration ──
// Usage: bun run scripts/generate-qr-codes.ts [--format svg|png|jpeg] [--scale N]
// Examples:
//   bun run scripts/generate-qr-codes.ts                  → SVG (default)
//   bun run scripts/generate-qr-codes.ts --format png     → PNG at 3x scale
//   bun run scripts/generate-qr-codes.ts --format jpeg    → JPEG at 3x scale
//   bun run scripts/generate-qr-codes.ts --format png --scale 5  → PNG at 5x scale

type OutputFormat = "svg" | "png" | "jpeg";

function parseArgs(): { format: OutputFormat; scale: number } {
  const args = process.argv.slice(2);
  let format: OutputFormat = "svg";
  let scale = 3;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--format" && args[i + 1]) {
      const f = args[i + 1].toLowerCase();
      if (f === "svg" || f === "png" || f === "jpeg" || f === "jpg") {
        format = f === "jpg" ? "jpeg" : f;
      } else {
        console.error(`Invalid format "${args[i + 1]}". Use: svg, png, jpeg`);
        process.exit(1);
      }
      i++;
    } else if (args[i] === "--scale" && args[i + 1]) {
      scale = parseInt(args[i + 1], 10);
      if (isNaN(scale) || scale < 1 || scale > 10) {
        console.error("Scale must be between 1 and 10");
        process.exit(1);
      }
      i++;
    }
  }

  return { format, scale };
}

const config = parseArgs();

const URL = "https://www.colorforstrength.com/";
const OUT = join(import.meta.dir, "..", "public", "qr-codes");

// ── Output helper ──
async function writeOutput(name: string, svgContent: string) {
  if (config.format === "svg") {
    writeFileSync(join(OUT, `${name}.svg`), svgContent);
    return;
  }

  const ext = config.format;
  const pipeline = sharp(Buffer.from(svgContent), { density: 72 * config.scale });

  if (config.format === "png") {
    await pipeline.png().toFile(join(OUT, `${name}.png`));
  } else {
    await pipeline.jpeg({ quality: 95 }).toFile(join(OUT, `${name}.jpeg`));
  }
}

// SOS Wheel colors
const COLORS = {
  orange: "#F26522",
  yellow: "#FFC20E",
  green: "#39B54A",
  blue: "#29ABE2",
  purple: "#92278F",
  red: "#ED1C24",
  lightblue: "#87CEEB",
  gray: "#808080",
};

const RAINBOW = [
  COLORS.red,
  COLORS.orange,
  COLORS.yellow,
  COLORS.green,
  COLORS.blue,
  COLORS.purple,
];

// Helper: get QR matrix
async function getMatrix(): Promise<boolean[][]> {
  const qr = QRCode.create(URL, { errorCorrectionLevel: "H" });
  const size = qr.modules.size;
  const data = qr.modules.data;
  const matrix: boolean[][] = [];
  for (let y = 0; y < size; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < size; x++) {
      row.push(data[y * size + x] === 1);
    }
    matrix.push(row);
  }
  return matrix;
}

function isFinderPattern(x: number, y: number, size: number): boolean {
  return (
    (x < 7 && y < 7) ||
    (x >= size - 7 && y < 7) ||
    (x < 7 && y >= size - 7)
  );
}

// ── Variant 1: Clean Rainbow Gradient ──
async function rainbowGradient() {
  const matrix = await getMatrix();
  const size = matrix.length;
  const cellSize = 12;
  const margin = 4;
  const totalCells = size + margin * 2;
  const svgSize = totalCells * cellSize;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize} ${svgSize}" width="${svgSize}" height="${svgSize}">`;
  svg += `<defs>`;
  svg += `<linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="100%">`;
  RAINBOW.forEach((c, i) => {
    svg += `<stop offset="${(i / (RAINBOW.length - 1)) * 100}%" stop-color="${c}"/>`;
  });
  svg += `</linearGradient>`;
  svg += `</defs>`;
  svg += `<rect width="${svgSize}" height="${svgSize}" fill="white" rx="20"/>`;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (matrix[y][x]) {
        const px = (x + margin) * cellSize;
        const py = (y + margin) * cellSize;
        svg += `<rect x="${px}" y="${py}" width="${cellSize}" height="${cellSize}" fill="url(#rainbow)"/>`;
      }
    }
  }

  // Add text below
  const textY = svgSize - 12;
  svg += `<text x="${svgSize / 2}" y="${textY}" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="url(#rainbow)">MILFORD COLOR RUN 5K</text>`;

  svg += `</svg>`;
  await writeOutput("qr-rainbow-gradient", svg);
  console.log("✓ Rainbow gradient QR");
}

// ── Variant 2: Rounded Dots with Color Bands ──
async function colorDots() {
  const matrix = await getMatrix();
  const size = matrix.length;
  const cellSize = 14;
  const margin = 5;
  const totalCells = size + margin * 2;
  const svgSize = totalCells * cellSize;
  const dotRadius = cellSize * 0.4;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize} ${svgSize}" width="${svgSize}" height="${svgSize}">`;
  svg += `<rect width="${svgSize}" height="${svgSize}" fill="white" rx="24"/>`;

  // Draw finder patterns as rounded squares
  const finderPositions = [
    [margin, margin],
    [margin + size - 7, margin],
    [margin, margin + size - 7],
  ];

  for (const [fx, fy] of finderPositions) {
    const px = fx * cellSize;
    const py = fy * cellSize;
    const fSize = 7 * cellSize;
    svg += `<rect x="${px}" y="${py}" width="${fSize}" height="${fSize}" rx="12" fill="${COLORS.purple}" />`;
    svg += `<rect x="${px + cellSize}" y="${py + cellSize}" width="${fSize - 2 * cellSize}" height="${fSize - 2 * cellSize}" rx="8" fill="white" />`;
    svg += `<rect x="${px + 2 * cellSize}" y="${py + 2 * cellSize}" width="${fSize - 4 * cellSize}" height="${fSize - 4 * cellSize}" rx="6" fill="${COLORS.blue}" />`;
  }

  // Draw data dots with color bands (horizontal rainbow stripes)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (matrix[y][x] && !isFinderPattern(x, y, size)) {
        const cx = (x + margin) * cellSize + cellSize / 2;
        const cy = (y + margin) * cellSize + cellSize / 2;
        const colorIndex = Math.floor((y / size) * RAINBOW.length);
        const color = RAINBOW[Math.min(colorIndex, RAINBOW.length - 1)];
        svg += `<circle cx="${cx}" cy="${cy}" r="${dotRadius}" fill="${color}"/>`;
      }
    }
  }

  svg += `</svg>`;
  await writeOutput("qr-color-dots", svg);
  console.log("✓ Color dots QR");
}

// ── Variant 3: Paint Splatter Style ──
async function paintSplatter() {
  const matrix = await getMatrix();
  const size = matrix.length;
  const cellSize = 13;
  const margin = 5;
  const totalCells = size + margin * 2;
  const svgSize = totalCells * cellSize;

  // Seeded pseudo-random
  let seed = 42;
  function rand() {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  }

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize} ${svgSize}" width="${svgSize}" height="${svgSize}">`;
  svg += `<rect width="${svgSize}" height="${svgSize}" fill="white" rx="20"/>`;

  // Background paint splatter decorations
  for (let i = 0; i < 30; i++) {
    const cx = rand() * svgSize;
    const cy = rand() * svgSize;
    const r = 8 + rand() * 25;
    const color = RAINBOW[Math.floor(rand() * RAINBOW.length)];
    svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="0.08"/>`;
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (matrix[y][x]) {
        const px = (x + margin) * cellSize;
        const py = (y + margin) * cellSize;
        const color = RAINBOW[Math.floor(rand() * RAINBOW.length)];

        if (isFinderPattern(x, y, size)) {
          svg += `<rect x="${px}" y="${py}" width="${cellSize}" height="${cellSize}" fill="#1a1a2e"/>`;
        } else {
          // Slightly randomized size for organic feel
          const variation = 0.8 + rand() * 0.4;
          const s = cellSize * variation;
          const offset = (cellSize - s) / 2;
          svg += `<rect x="${px + offset}" y="${py + offset}" width="${s}" height="${s}" rx="${s * 0.35}" fill="${color}" opacity="${0.85 + rand() * 0.15}"/>`;
        }
      }
    }
  }

  // Title at bottom
  svg += `<text x="${svgSize / 2}" y="${svgSize - 10}" text-anchor="middle" font-family="'Comic Sans MS', cursive, sans-serif" font-size="26" font-weight="bold" fill="${COLORS.purple}">Scan to Register! 🎨</text>`;

  svg += `</svg>`;
  await writeOutput("qr-paint-splatter", svg);
  console.log("✓ Paint splatter QR");
}

// ── Variant 4: Dark Theme with Glow ──
async function darkGlow() {
  const matrix = await getMatrix();
  const size = matrix.length;
  const cellSize = 12;
  const margin = 5;
  const totalCells = size + margin * 2;
  const svgSize = totalCells * cellSize;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize} ${svgSize}" width="${svgSize}" height="${svgSize}">`;
  svg += `<defs>`;
  svg += `<filter id="glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
  svg += `<radialGradient id="bgGrad" cx="50%" cy="50%"><stop offset="0%" stop-color="#1a1a2e"/><stop offset="100%" stop-color="#0A0A0B"/></radialGradient>`;
  svg += `</defs>`;
  svg += `<rect width="${svgSize}" height="${svgSize}" fill="url(#bgGrad)" rx="20"/>`;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (matrix[y][x]) {
        const px = (x + margin) * cellSize;
        const py = (y + margin) * cellSize;
        const dist = Math.sqrt(
          Math.pow(x - size / 2, 2) + Math.pow(y - size / 2, 2)
        );
        const angle = Math.atan2(y - size / 2, x - size / 2);
        const colorIndex =
          Math.floor(((angle + Math.PI) / (2 * Math.PI)) * RAINBOW.length) %
          RAINBOW.length;
        const color = RAINBOW[colorIndex];

        if (isFinderPattern(x, y, size)) {
          svg += `<rect x="${px}" y="${py}" width="${cellSize}" height="${cellSize}" fill="${COLORS.blue}" filter="url(#glow)"/>`;
        } else {
          svg += `<rect x="${px + 1}" y="${py + 1}" width="${cellSize - 2}" height="${cellSize - 2}" rx="2" fill="${color}" filter="url(#glow)" opacity="0.95"/>`;
        }
      }
    }
  }

  // Glowing title
  svg += `<text x="${svgSize / 2}" y="${svgSize - 8}" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="${COLORS.blue}" filter="url(#glow)">MILFORD COLOR RUN 5K</text>`;
  svg += `<text x="${svgSize / 2}" y="${svgSize - 8 + 22}" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="${COLORS.lightblue}" opacity="0.8">May 2, 2026 • Scan to Register</text>`;

  svg += `</svg>`;
  await writeOutput("qr-dark-glow", svg);
  console.log("✓ Dark glow QR");
}

// ── Variant 5: SOS Wheel Center Logo ──
async function sosWheelCenter() {
  const matrix = await getMatrix();
  const size = matrix.length;
  const cellSize = 14;
  const margin = 5;
  const totalCells = size + margin * 2;
  const svgSize = totalCells * cellSize;
  const center = svgSize / 2;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize} ${svgSize}" width="${svgSize}" height="${svgSize}">`;
  svg += `<rect width="${svgSize}" height="${svgSize}" fill="white" rx="24"/>`;

  // Draw QR modules, skipping center area for logo
  const centerCellX = Math.floor(size / 2);
  const centerCellY = Math.floor(size / 2);
  const logoRadius = 5; // cells to clear for logo

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (matrix[y][x]) {
        const distFromCenter = Math.sqrt(
          Math.pow(x - centerCellX, 2) + Math.pow(y - centerCellY, 2)
        );
        if (distFromCenter < logoRadius) continue; // skip center for logo

        const px = (x + margin) * cellSize;
        const py = (y + margin) * cellSize;

        if (isFinderPattern(x, y, size)) {
          svg += `<rect x="${px}" y="${py}" width="${cellSize}" height="${cellSize}" fill="#1a1a2e"/>`;
        } else {
          svg += `<rect x="${px + 0.5}" y="${py + 0.5}" width="${cellSize - 1}" height="${cellSize - 1}" rx="3" fill="#1a1a2e"/>`;
        }
      }
    }
  }

  // Draw SOS color wheel in center
  const wheelRadius = logoRadius * cellSize - 8;
  const wheelColors = [
    COLORS.orange,
    COLORS.yellow,
    COLORS.green,
    COLORS.blue,
    COLORS.gray,
    COLORS.purple,
    COLORS.lightblue,
    COLORS.red,
  ];
  const sliceAngle = (2 * Math.PI) / wheelColors.length;

  svg += `<circle cx="${center}" cy="${center}" r="${wheelRadius + 4}" fill="white"/>`;

  for (let i = 0; i < wheelColors.length; i++) {
    const startAngle = i * sliceAngle - Math.PI / 2;
    const endAngle = (i + 1) * sliceAngle - Math.PI / 2;
    const x1 = center + wheelRadius * Math.cos(startAngle);
    const y1 = center + wheelRadius * Math.sin(startAngle);
    const x2 = center + wheelRadius * Math.cos(endAngle);
    const y2 = center + wheelRadius * Math.sin(endAngle);
    svg += `<path d="M${center},${center} L${x1},${y1} A${wheelRadius},${wheelRadius} 0 0,1 ${x2},${y2} Z" fill="${wheelColors[i]}"/>`;
  }

  svg += `<circle cx="${center}" cy="${center}" r="${wheelRadius * 0.3}" fill="white"/>`;
  svg += `<text x="${center}" y="${center + 5}" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#1a1a2e">SOS</text>`;

  // Bottom label
  svg += `<text x="${svgSize / 2}" y="${svgSize - 14}" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#1a1a2e">Sources of Strength</text>`;
  svg += `<text x="${svgSize / 2}" y="${svgSize - 14 + 20}" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="${COLORS.purple}">Color Run 5K • May 2</text>`;

  svg += `</svg>`;
  await writeOutput("qr-sos-wheel", svg);
  console.log("✓ SOS wheel center QR");
}

// ── Variant 6: Minimal Teal & Purple (matches site theme) ──
async function minimalThemed() {
  const matrix = await getMatrix();
  const size = matrix.length;
  const cellSize = 12;
  const margin = 4;
  const totalCells = size + margin * 2;
  const svgSize = totalCells * cellSize;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize} ${svgSize}" width="${svgSize}" height="${svgSize}">`;
  svg += `<defs>`;
  svg += `<linearGradient id="tealPurple" x1="0%" y1="0%" x2="100%" y2="100%">`;
  svg += `<stop offset="0%" stop-color="${COLORS.blue}"/>`;
  svg += `<stop offset="100%" stop-color="${COLORS.purple}"/>`;
  svg += `</linearGradient>`;
  svg += `</defs>`;
  svg += `<rect width="${svgSize}" height="${svgSize}" fill="#0A0A0B" rx="16"/>`;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (matrix[y][x]) {
        const px = (x + margin) * cellSize;
        const py = (y + margin) * cellSize;
        svg += `<rect x="${px}" y="${py}" width="${cellSize}" height="${cellSize}" fill="url(#tealPurple)"/>`;
      }
    }
  }

  svg += `</svg>`;
  await writeOutput("qr-minimal-themed", svg);
  console.log("✓ Minimal themed QR");
}

// ── Variant 7: Runner Silhouette Frame ──
async function runnerFrame() {
  const matrix = await getMatrix();
  const size = matrix.length;
  const cellSize = 11;
  const margin = 6;
  const totalCells = size + margin * 2;
  const qrArea = totalCells * cellSize;
  const padding = 40;
  const bannerH = 80;
  const svgW = qrArea + padding * 2;
  const svgH = qrArea + padding * 2 + bannerH;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgW} ${svgH}" width="${svgW}" height="${svgH}">`;

  // Background with rainbow border
  svg += `<defs>`;
  svg += `<linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">`;
  RAINBOW.forEach((c, i) => {
    svg += `<stop offset="${(i / (RAINBOW.length - 1)) * 100}%" stop-color="${c}"/>`;
  });
  svg += `</linearGradient>`;
  svg += `</defs>`;

  // Outer rainbow border
  svg += `<rect width="${svgW}" height="${svgH}" rx="20" fill="url(#borderGrad)"/>`;
  svg += `<rect x="4" y="4" width="${svgW - 8}" height="${svgH - 8}" rx="18" fill="white"/>`;

  // QR Code
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (matrix[y][x]) {
        const px = padding + (x + margin) * cellSize;
        const py = padding + (y + margin) * cellSize;
        svg += `<rect x="${px}" y="${py}" width="${cellSize}" height="${cellSize}" fill="#1a1a2e"/>`;
      }
    }
  }

  // Banner at bottom
  const bannerY = qrArea + padding + 10;
  svg += `<text x="${svgW / 2}" y="${bannerY + 25}" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="900" fill="${COLORS.purple}">MILFORD COLOR RUN 5K</text>`;
  svg += `<text x="${svgW / 2}" y="${bannerY + 50}" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="${COLORS.blue}">May 2, 2026 • Register Now!</text>`;

  // Small color powder bursts in corners
  const burstPositions = [
    [30, 30],
    [svgW - 30, 30],
    [30, qrArea + padding - 10],
    [svgW - 30, qrArea + padding - 10],
  ];
  burstPositions.forEach(([bx, by], i) => {
    const color = RAINBOW[i % RAINBOW.length];
    for (let j = 0; j < 5; j++) {
      const angle = (j / 5) * Math.PI * 2;
      const dist = 8 + j * 3;
      const cx = bx + Math.cos(angle) * dist;
      const cy = by + Math.sin(angle) * dist;
      svg += `<circle cx="${cx}" cy="${cy}" r="${4 - j * 0.5}" fill="${color}" opacity="${0.7 - j * 0.1}"/>`;
    }
  });

  svg += `</svg>`;
  await writeOutput("qr-runner-frame", svg);
  console.log("✓ Runner frame QR");
}

// ── Run all ──
import { mkdirSync } from "fs";
mkdirSync(OUT, { recursive: true });

await Promise.all([
  rainbowGradient(),
  colorDots(),
  paintSplatter(),
  darkGlow(),
  sosWheelCenter(),
  minimalThemed(),
  runnerFrame(),
]);

console.log(`\n🎉 All QR codes generated in public/qr-codes/ (${config.format}${config.format !== "svg" ? `, ${config.scale}x scale` : ""})`);
console.log(`   URL: ${URL}`);
