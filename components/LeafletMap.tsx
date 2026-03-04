"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { PARK_CENTER, routeCoordinates, pointsOfInterest, POIType } from "./RouteMap";

interface LeafletMapProps {
  selectedPOI: string | null;
  onPOISelect: (id: string | null) => void;
}

// SVG icons for each POI type
const getIconSVG = (type: POIType, color: string): string => {
  const icons: Record<POIType, string> = {
    start: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>`,
    parking: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>`,
    registration: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>`,
    restrooms: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v2a2 2 0 1 1-4 0V2"/><path d="M4 7h8v6H4z"/><path d="M6 13v8"/><path d="M10 13v8"/><path d="M17 2a2 2 0 1 0 0 4"/><path d="M14 7h6v4h-6z"/><path d="M17 11v10"/><path d="M14 17h6"/></svg>`,
    food: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>`,
    photo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`,
    station: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="${color}" stroke-width="1"><circle cx="12" cy="12" r="10" fill="${color}" opacity="0.3"/><circle cx="12" cy="7" r="3"/><circle cx="7" cy="15" r="2.5"/><circle cx="17" cy="15" r="2.5"/><circle cx="12" cy="17" r="2"/></svg>`,
    nature: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14h-.3a1 1 0 0 1-.7-1.7L9 9h-.2A1 1 0 0 1 8 7.3L12 3l4 4.3a1 1 0 0 1-.8 1.7H15l3 3.3a1 1 0 0 1-.7 1.7H17Z"/><path d="M12 22v-3"/></svg>`,
    water: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>`,
  };
  return icons[type] || icons.station;
};

// Create custom divIcon for markers
const createCustomIcon = (type: POIType, color: string, priority: number) => {
  const size = priority === 1 ? 32 : priority === 2 ? 28 : 24;
  const iconSize = priority === 1 ? 18 : priority === 2 ? 16 : 14;

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: rgba(15, 15, 20, 0.9);
        border: 2px solid ${color};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 10px ${color}60, 0 4px 8px rgba(0,0,0,0.3);
        transition: transform 0.2s, box-shadow 0.2s;
      ">
        <div style="width: ${iconSize}px; height: ${iconSize}px;">
          ${getIconSVG(type, color)}
        </div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

export default function LeafletMap({ selectedPOI, onPOISelect }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      center: [PARK_CENTER.lat, PARK_CENTER.lng],
      zoom: 16,
      zoomControl: true,
      scrollWheelZoom: true,
      attributionControl: true,
    });

    mapInstanceRef.current = map;

    // Add dark-themed tile layer (CartoDB Dark Matter)
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20,
      }
    ).addTo(map);

    // SOS wheel colors for route gradient
    const colors = [
      "#F26522", // Orange - Family Support
      "#FFC20E", // Yellow - Positive Friends
      "#39B54A", // Green - Mentors
      "#29ABE2", // Blue - Healthy Activities
      "#808080", // Gray - Generosity
      "#92278F", // Purple - Spirituality
      "#87CEEB", // Light Blue - Physical Health
      "#ED1C24", // Red - Mental Health
    ];

    // Draw route as gradient segments
    for (let i = 0; i < routeCoordinates.length - 1; i++) {
      const colorIndex = Math.floor(
        (i / (routeCoordinates.length - 1)) * colors.length
      );
      L.polyline([routeCoordinates[i], routeCoordinates[i + 1]], {
        color: colors[colorIndex % colors.length],
        weight: 5,
        opacity: 0.9,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(map);
    }

    // Add glow effect for route
    const glowLine = L.polyline(routeCoordinates, {
      color: "#29ABE2",
      weight: 12,
      opacity: 0.3,
      lineCap: "round",
      lineJoin: "round",
    }).addTo(map);
    glowLine.bringToBack();

    // // Add POI markers with custom icons
    // pointsOfInterest.forEach((poi) => {
    //   const customIcon = createCustomIcon(poi.type, poi.color, poi.priority);
    //
    //   const marker = L.marker([poi.lat, poi.lng], {
    //     icon: customIcon,
    //   }).addTo(map);
    //
    //   // Create custom popup
    //   const popupContent = `
    //     <div style="
    //       background: rgba(15, 15, 20, 0.95);
    //       border: 1px solid ${poi.color}40;
    //       border-radius: 12px;
    //       padding: 12px 16px;
    //       min-width: 180px;
    //       box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    //     ">
    //       <div style="
    //         display: flex;
    //         align-items: center;
    //         gap: 8px;
    //         margin-bottom: 6px;
    //       ">
    //         <div style="
    //           width: 24px;
    //           height: 24px;
    //           display: flex;
    //           align-items: center;
    //           justify-content: center;
    //         ">
    //           ${getIconSVG(poi.type, poi.color)}
    //         </div>
    //         <strong style="color: white; font-size: 14px;">${poi.label}</strong>
    //       </div>
    //       <p style="color: #9ca3af; font-size: 12px; margin: 0;">${poi.description}</p>
    //     </div>
    //   `;
    //
    //   marker.bindPopup(popupContent, {
    //     closeButton: false,
    //     className: "custom-popup",
    //     offset: [0, -5],
    //   });
    //
    //   marker.on("mouseover", () => {
    //     marker.openPopup();
    //     onPOISelect(poi.id);
    //   });
    //
    //   marker.on("mouseout", () => {
    //     marker.closePopup();
    //     onPOISelect(null);
    //   });
    //
    //   marker.on("click", () => {
    //     marker.openPopup();
    //     onPOISelect(poi.id);
    //   });
    //
    //   markersRef.current.set(poi.id, marker);
    // });

    // // Add pulsing effect for start marker
    // const startPOI = pointsOfInterest.find((p) => p.id === "start");
    // if (startPOI) {
    //   L.circleMarker([startPOI.lat, startPOI.lng], {
    //     radius: 25,
    //     fillColor: startPOI.color,
    //     color: startPOI.color,
    //     weight: 2,
    //     opacity: 0.5,
    //     fillOpacity: 0.1,
    //     className: "pulse-marker",
    //   }).addTo(map);
    // }

    setIsMapReady(true);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [onPOISelect]);

  // Handle external POI selection
  useEffect(() => {
    if (!isMapReady || !selectedPOI) return;

    const marker = markersRef.current.get(selectedPOI);
    if (marker) {
      marker.openPopup();
    }
  }, [selectedPOI, isMapReady]);

  return (
    <>
      <style jsx global>{`
        .custom-popup .leaflet-popup-content-wrapper {
          background: transparent;
          box-shadow: none;
          padding: 0;
        }
        .custom-popup .leaflet-popup-content {
          margin: 0;
        }
        .custom-popup .leaflet-popup-tip {
          display: none;
        }
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        .custom-marker:hover > div {
          transform: scale(1.15);
          box-shadow: 0 0 20px currentColor, 0 6px 12px rgba(0,0,0,0.4);
        }
        .pulse-marker {
          animation: pulse 2s ease-out infinite;
        }
        @keyframes pulse {
          0% {
            stroke-opacity: 0.5;
            fill-opacity: 0.1;
            transform: scale(1);
          }
          50% {
            stroke-opacity: 0.8;
            fill-opacity: 0.2;
            transform: scale(1.1);
          }
          100% {
            stroke-opacity: 0.5;
            fill-opacity: 0.1;
            transform: scale(1);
          }
        }
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
      `}</style>
      <div ref={mapRef} className="w-full h-full" />
    </>
  );
}
