"use client";

import { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { PARK_CENTER, routeCoordinates, legBoundaries } from "./RouteMap";

interface LeafletMapProps {
  selectedPOI: string | null;
  onPOISelect: (id: string | null) => void;
}

// Leg colors: red → yellow → green → purple
const LEG_COLORS = ["#ED1C24", "#FFC20E", "#39B54A", "#92278F"];

// 8 Sources of Strength — fixed color + name pairing
const SOS_STRENGTHS = [
  { color: "#F26522", strength: "Family Support" },
  { color: "#FFC20E", strength: "Positive Friends" },
  { color: "#39B54A", strength: "Mentors" },
  { color: "#29ABE2", strength: "Healthy Activities" },
  { color: "#808080", strength: "Generosity" },
  { color: "#92278F", strength: "Spirituality" },
  { color: "#87CEEB", strength: "Physical Health" },
  { color: "#ED1C24", strength: "Mental Health" },
];

// 16 color stations: 8 strengths cycled twice, base fractions evenly spaced
// Actual positions jittered ±3% on each spawn to avoid implying fixed race-day locations
const COLOR_STATION_BASES = [
  0.05, 0.11, 0.17, 0.23, 0.29, 0.35, 0.41, 0.47,
  0.53, 0.59, 0.65, 0.71, 0.77, 0.83, 0.89, 0.95,
];

// SVG icons
const SVG_ICONS = {
  water: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" stroke="#29ABE2" stroke-width="2" stroke-linecap="round"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" stroke="#29ABE2" stroke-width="2" stroke-linecap="round" opacity="0.7"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" stroke="#29ABE2" stroke-width="2" stroke-linecap="round" opacity="0.4"/></svg>`,
  tree: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3L6 12h3l-2 5h10l-2-5h3L12 3z" fill="#39B54A" fill-opacity="0.25" stroke="#39B54A" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 17v5" stroke="#8B6914" stroke-width="2" stroke-linecap="round"/></svg>`,
  colorSplat: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="7" fill="currentColor" fill-opacity="0.35" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="8" r="2.5" fill="currentColor" fill-opacity="0.5"/><circle cx="16" cy="10" r="2" fill="currentColor" fill-opacity="0.5"/><circle cx="13" cy="16" r="2.5" fill="currentColor" fill-opacity="0.5"/></svg>`,
};

// Landmark POIs
const LANDMARK_POIS = [
  { id: "lake", label: "Lake", svgKey: "water" as const, lat: 39.1872, lng: -84.2038, routeIdx: 55, color: "#29ABE2" },
  { id: "barkpark", label: "Bark Park", svgKey: "tree" as const, lat: 39.1896, lng: -84.1984, routeIdx: 25, color: "#39B54A" },
];

// =============================================
// Utility functions
// =============================================

function computeCumulativeDistances(coords: [number, number][]): number[] {
  const dists = [0];
  for (let i = 1; i < coords.length; i++) {
    const [lat1, lng1] = coords[i - 1];
    const [lat2, lng2] = coords[i];
    dists.push(dists[i - 1] + Math.sqrt((lat2 - lat1) ** 2 + (lng2 - lng1) ** 2));
  }
  return dists;
}

function interpolatePosition(
  coords: [number, number][],
  cumDists: number[],
  fraction: number
): { lat: number; lng: number; segIndex: number } {
  const f = Math.max(0, Math.min(1, fraction));
  const targetDist = f * cumDists[cumDists.length - 1];
  for (let i = 1; i < cumDists.length; i++) {
    if (cumDists[i] >= targetDist) {
      const t = cumDists[i] === cumDists[i - 1] ? 0 : (targetDist - cumDists[i - 1]) / (cumDists[i] - cumDists[i - 1]);
      return {
        lat: coords[i - 1][0] + t * (coords[i][0] - coords[i - 1][0]),
        lng: coords[i - 1][1] + t * (coords[i][1] - coords[i - 1][1]),
        segIndex: i - 1,
      };
    }
  }
  const last = coords[coords.length - 1];
  return { lat: last[0], lng: last[1], segIndex: coords.length - 2 };
}

function getLegIndex(coordIndex: number): number {
  if (coordIndex < legBoundaries.leg1End) return 0;
  if (coordIndex < legBoundaries.leg2End) return 1;
  if (coordIndex < legBoundaries.leg3End) return 2;
  return 3;
}

function jitterFraction(base: number): number {
  const jitter = (Math.random() - 0.5) * 0.06; // ±3%
  return Math.max(0.02, Math.min(0.98, base + jitter));
}

// =============================================
// Component
// =============================================

export default function LeafletMap({ selectedPOI, onPOISelect }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const drawAnimRef = useRef<number>(0);
  const runnerAnimRef = useRef<number>(0);
  const hasDrawnRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const visibilityObserverRef = useRef<IntersectionObserver | null>(null);
  const isVisibleRef = useRef(false);
  const colorStationTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const onPOISelectRef = useRef(onPOISelect);
  onPOISelectRef.current = onPOISelect;

  const initMap = useCallback(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Pre-compute distances
    const cumDists = computeCumulativeDistances(routeCoordinates);
    const totalDist = cumDists[cumDists.length - 1];
    const totalCoords = routeCoordinates.length;

    // Leg boundary fractions (distance-based)
    const legBoundaryFractions = [
      cumDists[legBoundaries.leg1End] / totalDist,
      cumDists[legBoundaries.leg2End] / totalDist,
      cumDists[legBoundaries.leg3End] / totalDist,
      1.0,
    ];

    // Landmark distance fractions
    const landmarkFractions = LANDMARK_POIS.map(p => cumDists[Math.min(p.routeIdx, totalCoords - 1)] / totalDist);

    // Split route into 4 legs (for coordinate slicing during draw)
    const legs: [number, number][][] = [
      routeCoordinates.slice(0, legBoundaries.leg1End + 1),
      routeCoordinates.slice(legBoundaries.leg1End, legBoundaries.leg2End + 1),
      routeCoordinates.slice(legBoundaries.leg2End, legBoundaries.leg3End + 1),
      routeCoordinates.slice(legBoundaries.leg3End),
    ];

    // Compute route bounding box and fit map to it
    let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
    routeCoordinates.forEach(([lat, lng]) => {
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
    });
    const routeBounds = L.latLngBounds([minLat, minLng], [maxLat, maxLng]);

    // Initialize map fitted to route bounds
    const map = L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
      attributionControl: true,
    });
    map.fitBounds(routeBounds, { padding: [30, 30] });
    mapInstanceRef.current = map;

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20,
      }
    ).addTo(map);

    // =============================================
    // LAYER 1: Base trail — full route in neutral gray (always visible)
    // =============================================
    const baseTrail = L.polyline(prefersReducedMotion ? routeCoordinates : [], {
      color: "rgba(255,255,255,0.25)",
      weight: 3,
      opacity: 1,
      lineCap: "round",
      lineJoin: "round",
      className: "route-base-trail",
    }).addTo(map);

    // =============================================
    // LAYER 2: Glow underlay — active leg only, blurred for neon halo
    // =============================================
    const glowLine = L.polyline([], {
      color: LEG_COLORS[0],
      weight: 10,
      opacity: 0.15,
      lineCap: "round",
      lineJoin: "round",
      className: "route-glow",
    }).addTo(map);

    // =============================================
    // LAYER 3: Active line — active leg only, bright with drop-shadow
    // =============================================
    const activeLine = L.polyline([], {
      color: LEG_COLORS[0],
      weight: 5,
      opacity: 1,
      lineCap: "round",
      lineJoin: "round",
      className: "route-active",
    }).addTo(map);

    // =============================================
    // PAINT HEAD (visible during draw only)
    // =============================================
    const startCoord: [number, number] = [39.186959, -84.199238];

    const paintHead = L.circleMarker(startCoord, {
      radius: 7,
      fillColor: LEG_COLORS[0],
      color: "#fff",
      weight: 2.5,
      fillOpacity: 0,
      opacity: 0,
      className: "paint-head",
    }).addTo(map);

    const paintGlow = L.circleMarker(startCoord, {
      radius: 16,
      fillColor: LEG_COLORS[0],
      color: LEG_COLORS[0],
      weight: 0,
      fillOpacity: 0,
      opacity: 0,
    }).addTo(map);

    // =============================================
    // START / FINISH — clean text badge, no SVG icon
    // =============================================
    // Measure-based anchor: badge is ~34px tall + 10px pin = 44px total height
    // Width ~160px, anchor at bottom-center of pin (tip points to coordinate)
    const sfIcon = L.divIcon({
      className: "custom-marker",
      html: `<div class="sf-marker" data-poi-id="startfinish">
        <div class="sf-badge">
          <span class="sf-text sf-start-text">START</span>
          <span class="sf-divider"></span>
          <span class="sf-text sf-finish-text">FINISH</span>
        </div>
        <div class="sf-pin"></div>
      </div>`,
      iconSize: [160, 46],
      iconAnchor: [80, 46],
    });
    const sfMarker = L.marker(startCoord, { icon: sfIcon, zIndexOffset: 1000 }).addTo(map);
    sfMarker.on("click", () => onPOISelectRef.current("start"));

    // =============================================
    // LANDMARK POI MARKERS (lake, bark park)
    // =============================================
    const landmarkEls: { el: HTMLElement | null }[] = [];

    LANDMARK_POIS.forEach((poi) => {
      const icon = L.divIcon({
        className: "custom-marker",
        html: `<div class="landmark-marker landmark-hidden" style="--marker-color: ${poi.color}" data-poi-id="${poi.id}">
          <div class="landmark-icon">${SVG_ICONS[poi.svgKey]}</div>
          <span class="landmark-label">${poi.label}</span>
        </div>`,
        iconSize: [0, 0],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([poi.lat, poi.lng], { icon }).addTo(map);
      marker.on("click", () => onPOISelectRef.current(poi.id));
      marker.on("mouseover", () => onPOISelectRef.current(poi.id));
      marker.on("mouseout", () => onPOISelectRef.current(null));
      landmarkEls.push({ el: null });
    });

    // =============================================
    // COLOR STATIONS — SOS strengths with labels, jittered positions
    // =============================================
    interface ColorStationState {
      marker: L.Marker;
      el: HTMLElement | null;
      baseFraction: number;
      currentFraction: number;
      sosIdx: number;
      visible: boolean;
      fadeTimeout: ReturnType<typeof setTimeout> | null;
    }
    const colorStations: ColorStationState[] = [];

    COLOR_STATION_BASES.forEach((baseFrac, i) => {
      const sosIdx = i % SOS_STRENGTHS.length;
      const sos = SOS_STRENGTHS[sosIdx];
      const frac = jitterFraction(baseFrac);
      const pos = interpolatePosition(routeCoordinates, cumDists, frac);

      const icon = L.divIcon({
        className: "custom-marker",
        html: `<div class="color-station-marker color-station-hidden" style="--station-color: ${sos.color}; color: ${sos.color}">
          ${SVG_ICONS.colorSplat}
          <span class="station-label">${sos.strength}</span>
        </div>`,
        iconSize: [0, 0],
        iconAnchor: [12, 12],
      });

      // Small alternating offset so stations sit just off the route line
      const offsets: [number, number][] = [
        [0.00015, 0],       // slightly above
        [0, 0.00020],       // slightly right
        [-0.00015, 0],      // slightly below
        [0, -0.00020],      // slightly left
      ];
      const [latOff, lngOff] = offsets[i % 4];
      const marker = L.marker([pos.lat + latOff, pos.lng + lngOff], { icon }).addTo(map);
      colorStations.push({
        marker, el: null, baseFraction: baseFrac,
        currentFraction: frac, sosIdx, visible: false, fadeTimeout: null,
      });
    });

    // Grab DOM refs after render
    setTimeout(() => {
      LANDMARK_POIS.forEach((poi, i) => {
        landmarkEls[i].el = map.getContainer().querySelector(`[data-poi-id="${poi.id}"]`) as HTMLElement | null;
      });
      colorStations.forEach((cs) => {
        const iconEl = (cs.marker as unknown as { _icon: HTMLElement })._icon;
        if (iconEl) cs.el = iconEl.querySelector(".color-station-marker") as HTMLElement | null;
      });
    }, 80);

    // =============================================
    // RUNNER DOT (post-draw loop)
    // =============================================
    const runnerDot = L.circleMarker(startCoord, {
      radius: 6, fillColor: LEG_COLORS[0], color: "#fff", weight: 2,
      fillOpacity: 0, opacity: 0, className: "runner-dot",
    }).addTo(map);

    const runnerGlow = L.circleMarker(startCoord, {
      radius: 16, fillColor: LEG_COLORS[0], color: LEG_COLORS[0], weight: 0,
      fillOpacity: 0, opacity: 0, className: "runner-glow",
    }).addTo(map);

    // =============================================
    // REDUCED MOTION — show everything instantly
    // =============================================
    if (prefersReducedMotion) {
      baseTrail.setLatLngs(routeCoordinates);
      setTimeout(() => {
        landmarkEls.forEach((lm) => {
          lm.el?.classList.remove("landmark-hidden");
          lm.el?.classList.add("landmark-visible");
        });
        colorStations.forEach((cs) => {
          if (cs.el) {
            cs.el.classList.remove("color-station-hidden");
            cs.el.classList.add("color-station-visible");
          }
        });
      }, 100);
      return;
    }

    // =============================================
    // SNAKE DRAW ANIMATION (6s)
    // =============================================
    const DRAW_DURATION = 6000;
    const revealedLandmarks = new Set<number>();
    let prevDrawLeg = -1;

    function runSnakeDraw() {
      if (hasDrawnRef.current) return;
      hasDrawnRef.current = true;

      paintHead.setStyle({ fillOpacity: 0.95, opacity: 0.95 });
      paintGlow.setStyle({ fillOpacity: 0.15, opacity: 0.2 });

      const startTime = performance.now();

      function animate(now: number) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / DRAW_DURATION, 1);
        const eased = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        // Single source of truth: distance-based position
        const pos = interpolatePosition(routeCoordinates, cumDists, eased);
        const coordIdx = pos.segIndex;
        const currentLeg = getLegIndex(coordIdx);

        // Move paint head
        const headColor = LEG_COLORS[currentLeg];
        paintHead.setLatLng([pos.lat, pos.lng]);
        paintHead.setStyle({ fillColor: headColor });
        paintGlow.setLatLng([pos.lat, pos.lng]);
        paintGlow.setStyle({ fillColor: headColor, color: headColor });

        // Draw base trail up to current position (gray)
        const baseCoords = routeCoordinates.slice(0, coordIdx + 1);
        baseCoords.push([pos.lat, pos.lng]);
        baseTrail.setLatLngs(baseCoords);

        // On leg transition, update glow + active colors
        if (currentLeg !== prevDrawLeg) {
          activeLine.setStyle({ color: LEG_COLORS[currentLeg] });
          glowLine.setStyle({ color: LEG_COLORS[currentLeg] });
          prevDrawLeg = currentLeg;
        }

        // Active colored line: only the current leg, up to paint head
        const legStarts = [0, legBoundaries.leg1End, legBoundaries.leg2End, legBoundaries.leg3End];
        const legStart = legStarts[currentLeg];
        const localIdx = coordIdx - legStart;
        const activeCoords = legs[currentLeg].slice(0, localIdx + 1);
        activeCoords.push([pos.lat, pos.lng]);
        activeLine.setLatLngs(activeCoords);
        glowLine.setLatLngs(activeCoords);

        // Reveal landmarks at their distance fractions
        LANDMARK_POIS.forEach((_, idx) => {
          if (!revealedLandmarks.has(idx) && eased >= landmarkFractions[idx]) {
            revealedLandmarks.add(idx);
            landmarkEls[idx]?.el?.classList.remove("landmark-hidden");
            landmarkEls[idx]?.el?.classList.add("landmark-visible");
          }
        });

        if (progress < 1) {
          drawAnimRef.current = requestAnimationFrame(animate);
        } else {
          onDrawComplete();
        }
      }

      function onDrawComplete() {
        // Full base trail
        baseTrail.setLatLngs(routeCoordinates);

        // Show full route active line momentarily, then clear for runner
        activeLine.setLatLngs([]);
        glowLine.setLatLngs([]);

        // Reveal remaining landmarks
        landmarkEls.forEach((lm) => {
          lm.el?.classList.remove("landmark-hidden");
          lm.el?.classList.add("landmark-visible");
        });

        // Fade paint head
        paintHead.setStyle({ fillOpacity: 0, opacity: 0 });
        paintGlow.setStyle({ fillOpacity: 0, opacity: 0 });

        // Burst on start/finish
        const sfEl = map.getContainer().querySelector('[data-poi-id="startfinish"]') as HTMLElement | null;
        sfEl?.classList.add("sf-burst");

        setTimeout(() => startRunnerLoop(), 600);
      }

      drawAnimRef.current = requestAnimationFrame(animate);
    }

    // =============================================
    // RUNNER DOT LOOP
    // =============================================
    const RUNNER_LOOP_DURATION = 20000;
    const RUNNER_PAUSE_DURATION = 2000;
    const RUNNER_CYCLE = RUNNER_LOOP_DURATION + RUNNER_PAUSE_DURATION;
    const MAX_VISIBLE_STATIONS = 4;
    const STATION_SPAWN_AHEAD = 0.08;
    const STATION_FADE_BEHIND = 0.06;

    function startRunnerLoop() {
      runnerDot.setStyle({ fillOpacity: 0.95, opacity: 0.9 });
      runnerGlow.setStyle({ fillOpacity: 0.15, opacity: 0.25 });

      let loopStart = performance.now();
      let prevRunnerLeg = -1;

      function animateRunner(now: number) {
        if (!isVisibleRef.current) {
          loopStart += 16;
          runnerAnimRef.current = requestAnimationFrame(animateRunner);
          return;
        }

        const elapsed = (now - loopStart) % RUNNER_CYCLE;
        // During pause, hold at finish (fraction = 1)
        const pausing = elapsed >= RUNNER_LOOP_DURATION;
        const fraction = pausing ? 1.0 : elapsed / RUNNER_LOOP_DURATION;

        // Reset leg tracking when a new cycle begins
        if (!pausing && fraction < 0.02 && prevRunnerLeg !== -1) {
          prevRunnerLeg = -1;
        }

        const pos = interpolatePosition(routeCoordinates, cumDists, fraction);
        const legIdx = getLegIndex(pos.segIndex);
        const color = LEG_COLORS[legIdx];

        // Move runner
        runnerDot.setLatLng([pos.lat, pos.lng]);
        runnerDot.setStyle({ fillColor: color });
        runnerGlow.setLatLng([pos.lat, pos.lng]);
        runnerGlow.setStyle({ fillColor: color, color });

        // Update active leg overlay
        if (legIdx !== prevRunnerLeg) {
          // Leg transition burst
          const dotPath = (runnerDot as unknown as { _path?: HTMLElement })._path;
          if (dotPath) {
            dotPath.classList.remove("leg-burst");
            void dotPath.offsetWidth; // force reflow
            dotPath.classList.add("leg-burst");
          }

          activeLine.setStyle({ color });
          glowLine.setStyle({ color });
          activeLine.setLatLngs(legs[legIdx]);
          glowLine.setLatLngs(legs[legIdx]);
          prevRunnerLeg = legIdx;
        }

        // --- Color station spawn/fade ---
        let visibleCount = 0;
        colorStations.forEach(cs => { if (cs.visible) visibleCount++; });

        colorStations.forEach((cs) => {
          if (!cs.el) return;
          const dist = fraction - cs.currentFraction;
          const wrapped = dist < -0.5 ? dist + 1 : dist > 0.5 ? dist - 1 : dist;

          if (!cs.visible && wrapped > -STATION_SPAWN_AHEAD && wrapped < 0 && visibleCount < MAX_VISIBLE_STATIONS) {
            cs.visible = true;
            visibleCount++;

            // Jitter position for this spawn
            const newFrac = jitterFraction(cs.baseFraction);
            cs.currentFraction = newFrac;
            const newPos = interpolatePosition(routeCoordinates, cumDists, newFrac);
            const stationOffsets: [number, number][] = [
              [0.00015, 0], [0, 0.00020], [-0.00015, 0], [0, -0.00020],
            ];
            const stationIdx = colorStations.indexOf(cs);
            const [oLat, oLng] = stationOffsets[stationIdx % 4];
            cs.marker.setLatLng([newPos.lat + oLat, newPos.lng + oLng]);

            cs.el.classList.remove("color-station-hidden", "color-station-fading");
            cs.el.classList.add("color-station-visible");
            if (cs.fadeTimeout) { clearTimeout(cs.fadeTimeout); cs.fadeTimeout = null; }
          } else if (cs.visible && wrapped > STATION_FADE_BEHIND) {
            cs.el.classList.remove("color-station-visible");
            cs.el.classList.add("color-station-fading");
            cs.visible = false; // Mark immediately so counter updates
            cs.fadeTimeout = setTimeout(() => {
              cs.el?.classList.remove("color-station-fading");
              cs.el?.classList.add("color-station-hidden");
            }, 2000);
            colorStationTimeoutsRef.current.push(cs.fadeTimeout);
          }
        });

        // --- Start/Finish glow near endpoints ---
        const sfEl = map.getContainer().querySelector('[data-poi-id="startfinish"]') as HTMLElement | null;
        if (fraction < 0.03 || fraction > 0.95) {
          sfEl?.classList.add("sf-glow");
        } else {
          sfEl?.classList.remove("sf-glow");
        }

        if (fraction > 0.995) {
          if (!sfEl?.classList.contains("sf-burst")) sfEl?.classList.add("sf-burst");
        } else if (fraction < 0.05) {
          sfEl?.classList.remove("sf-burst");
        }

        runnerAnimRef.current = requestAnimationFrame(animateRunner);
      }

      runnerAnimRef.current = requestAnimationFrame(animateRunner);
    }

    // =============================================
    // INTERSECTION OBSERVERS
    // =============================================
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasDrawnRef.current) runSnakeDraw();
        });
      },
      { threshold: 0.3 }
    );

    visibilityObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => { isVisibleRef.current = entry.isIntersecting; });
      },
      { threshold: 0.05 }
    );

    if (mapRef.current) {
      observerRef.current.observe(mapRef.current);
      visibilityObserverRef.current.observe(mapRef.current);
    }
  }, []);

  useEffect(() => {
    initMap();
    return () => {
      cancelAnimationFrame(drawAnimRef.current);
      cancelAnimationFrame(runnerAnimRef.current);
      colorStationTimeoutsRef.current.forEach(clearTimeout);
      observerRef.current?.disconnect();
      visibilityObserverRef.current?.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [initMap]);

  useEffect(() => {
    if (!selectedPOI) return;
  }, [selectedPOI]);

  return (
    <>
      <style jsx global>{`
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }

        /* ===== Route Layers ===== */
        .route-base-trail {
          /* Neutral gray, no effects */
        }
        .route-glow {
          filter: blur(3px);
          pointer-events: none;
        }
        .route-active {
          filter: drop-shadow(0 0 2px currentColor) drop-shadow(0 0 4px currentColor);
        }

        /* ===== Landmark Markers ===== */
        .landmark-marker {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px 4px 6px;
          background: rgba(10, 10, 16, 0.92);
          border: 1.5px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          white-space: nowrap;
          pointer-events: auto;
          cursor: pointer;
          position: relative;
          transition: transform 0.25s, box-shadow 0.3s, border-color 0.3s;
        }
        .landmark-marker:hover {
          transform: scale(1.08);
          border-color: rgba(255, 255, 255, 0.35);
          box-shadow: 0 0 14px rgba(255, 255, 255, 0.15);
        }
        .landmark-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .landmark-label {
          font-size: 10px;
          font-weight: 700;
          color: #d1d5db;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .landmark-hidden {
          opacity: 0;
          transform: scale(0.3);
          pointer-events: none;
        }
        .landmark-visible {
          animation: landmark-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes landmark-pop {
          0% { opacity: 0; transform: scale(0.3); }
          60% { opacity: 1; transform: scale(1.12); }
          80% { transform: scale(0.96); }
          100% { opacity: 1; transform: scale(1); }
        }

        /* ===== Start / Finish — text badge ===== */
        .sf-marker {
          display: flex;
          flex-direction: column;
          align-items: center;
          pointer-events: auto;
          cursor: pointer;
          position: relative;
        }
        .sf-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 16px;
          background: rgba(8, 8, 14, 0.95);
          border: 2px solid rgba(255, 255, 255, 0.18);
          border-radius: 10px;
          white-space: nowrap;
          transition: transform 0.25s, box-shadow 0.3s, border-color 0.3s;
        }
        .sf-badge:hover {
          transform: scale(1.06);
          border-color: rgba(255, 255, 255, 0.35);
        }
        .sf-text {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .sf-start-text { color: #39B54A; }
        .sf-finish-text { color: #ED1C24; }
        .sf-divider {
          width: 1px;
          height: 14px;
          background: rgba(255, 255, 255, 0.2);
          flex-shrink: 0;
        }
        .sf-pin {
          width: 2px;
          height: 8px;
          background: rgba(255, 255, 255, 0.25);
          margin-top: -1px;
        }
        /* Ring removed — glow/burst on .sf-badge handles the visual feedback */
        .sf-glow .sf-badge {
          border-color: rgba(255, 255, 255, 0.5) !important;
          box-shadow: 0 0 18px rgba(57, 181, 74, 0.4), 0 0 30px rgba(237, 28, 36, 0.2) !important;
        }
        .sf-burst .sf-badge {
          animation: sf-burst-anim 0.8s ease-out;
        }
        @keyframes sf-burst-anim {
          0% { box-shadow: 0 0 0 0 rgba(57, 181, 74, 0.6), 0 0 0 0 rgba(237, 28, 36, 0.4); }
          40% { box-shadow: 0 0 24px 10px rgba(57, 181, 74, 0.3), 0 0 16px 6px rgba(237, 28, 36, 0.3); }
          100% { box-shadow: 0 0 6px 2px rgba(57, 181, 74, 0.05), 0 0 4px 1px rgba(237, 28, 36, 0.05); }
        }

        /* ===== Color Station Markers ===== */
        .color-station-marker {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          padding: 5px 8px 4px;
          background: rgba(8, 8, 14, 0.88);
          border-radius: 10px;
          border: 1.5px solid var(--station-color, #FFC20E);
          box-shadow: 0 0 10px var(--station-color, #FFC20E);
          transition: opacity 0.4s, transform 0.4s;
          pointer-events: none;
          white-space: nowrap;
        }
        .station-label {
          font-size: 8px;
          font-weight: 700;
          color: var(--station-color, #FFC20E);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          text-shadow: 0 0 8px rgba(0, 0, 0, 0.9);
          line-height: 1;
        }
        .color-station-hidden {
          opacity: 0;
          transform: scale(0.2);
        }
        .color-station-visible {
          animation: station-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes station-pop {
          0% { opacity: 0; transform: scale(0.2); }
          70% { opacity: 1; transform: scale(1.15); }
          100% { opacity: 1; transform: scale(1); }
        }
        .color-station-fading {
          opacity: 0;
          transform: scale(0.6);
          transition: opacity 2s ease-out, transform 2s ease-out;
        }

        /* ===== Paint Head ===== */
        .paint-head {
          filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.8));
        }

        /* ===== Runner Dot ===== */
        .runner-dot {
          filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.6));
        }
        .runner-glow {
          animation: runner-pulse 0.8s ease-in-out infinite;
        }
        @keyframes runner-pulse {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.3); opacity: 0.35; }
        }

        /* Leg transition burst */
        .leg-burst {
          animation: leg-burst-anim 0.6s ease-out;
        }
        @keyframes leg-burst-anim {
          0% { filter: drop-shadow(0 0 0 currentColor); }
          30% { filter: drop-shadow(0 0 20px currentColor) drop-shadow(0 0 40px currentColor); }
          100% { filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.6)); }
        }

        /* ===== Map Base ===== */
        .leaflet-container {
          background: #0f0f14;
          font-family: inherit;
        }
        .leaflet-control-attribution {
          background: rgba(15, 15, 20, 0.8) !important;
          color: #6b7280 !important;
          font-size: 10px !important;
        }
        .leaflet-control-attribution a {
          color: #29ABE2 !important;
        }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3) !important;
        }
        .leaflet-control-zoom a {
          background: rgba(15, 15, 20, 0.9) !important;
          color: white !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        .leaflet-control-zoom a:hover {
          background: rgba(41, 171, 226, 0.2) !important;
        }

        /* ===== Reduced Motion ===== */
        @media (prefers-reduced-motion: reduce) {
          .route-glow,
          .runner-glow,
          .sf-ring { display: none; }
          .route-active { filter: none; }
          .runner-dot { filter: none; }
          .landmark-visible { animation: none; opacity: 1; transform: none; }
          .color-station-visible { animation: none; opacity: 1; transform: none; }
          .sf-burst .sf-badge { animation: none; }
        }
      `}</style>
      <div ref={mapRef} className="w-full h-full" />
    </>
  );
}
