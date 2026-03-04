"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  MapPin,
  Flag,
  TreePine,
  Waves,
  Car,
  Utensils,
  Droplets,
  Camera,
  Bath, Dog,
} from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import the map to avoid SSR issues with Leaflet
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[var(--background-tertiary)] rounded-xl">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[var(--sos-teal)] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-sm text-[var(--foreground-muted)]">Loading map...</p>
      </div>
    </div>
  ),
});

// Miami Meadows Park coordinates (from OpenStreetMap)
export const PARK_CENTER = {
  lat: 39.1885,
  lng: -84.2030,
};

// 5K Route coordinates sourced from OpenStreetMap Overpass API + calculated grass segments.
// Route: Start near playground → North on service road (Way 32542887) → West along
//        north edge (Way 220206682) → Lake loop (Way 717834401 NW corner → south → east) →
//        East across fields (grass) → North along east boundary (grass) → South on
//        service road back to Finish.
export const routeCoordinates: [number, number][] = [
  // === START (user-provided GPS) ===
  [39.186930, -84.199404],

  // === Phase 1: North on west service road (Way 32542887) to Bark Park ===
  [39.186907, -84.199618],
  [39.1879123, -84.199513],
  [39.1891363, -84.1993869],

  // === Phase 2: West across north edge (Way 220206682) ===
  [39.1891706, -84.1993029],
  [39.1892442, -84.1993560],
  [39.1892752, -84.1994121],
  [39.1892876, -84.1994979],
  [39.1893001, -84.2004528],
  [39.1894830, -84.2044225],
  [39.1894664, -84.2045136],
  [39.1894415, -84.2045673],
  [39.1892854, -84.2045718],

  // === Phase 3: Lake loop — NW corner (Way 717834401 indices 25→22) ===
  [39.1893812, -84.2049272],
  [39.1893945, -84.2051249],
  [39.1893766, -84.2052700],
  [39.1893340, -84.2053334],

  // === Lake loop — South along west side (Way 717834401 indices 21→10) ===
  [39.1892186, -84.2054198],
  [39.1883621, -84.2055593],
  [39.1882290, -84.2055593],
  [39.1881708, -84.2055056],
  [39.1881209, -84.2053984],
  [39.1881126, -84.2051301],
  [39.1880793, -84.2050014],
  [39.1879962, -84.2049156],
  [39.1875804, -84.2047761],
  [39.1873226, -84.2047224],
  [39.1871064, -84.2046795],
  [39.1868486, -84.2045937],

  // === Lake loop — East along south edge (Way 717834401 indices 9→0) ===
  [39.1864328, -84.2044006],
  [39.1863580, -84.2044006],
  [39.1861928, -84.2044319],
  [39.1860752, -84.2044542],
  [39.1859917, -84.2044442],
  [39.1859588, -84.2043577],
  [39.1859339, -84.2042826],
  [39.1857578, -84.2013044],
  [39.1857225, -84.2006014],
  [39.1856426, -84.1998278],

  // === Phase 4: South along west service road to park bottom (Way 32542887) ===
  [39.1856364, -84.1997415],
  [39.1855670, -84.1997482],
  [39.1853374, -84.1997686],
  [39.1845041, -84.1998426],
  [39.1840470, -84.1998831],
  [39.1836931, -84.1999146],
  [39.1835575, -84.1999266],

  // === Phase 5: East along south boundary (grass — calculated from park boundary) ===
  [39.1835500, -84.1995000],
  [39.1835400, -84.1990000],
  [39.1835300, -84.1985000],
  [39.1834300, -84.1978700],
  [39.1833500, -84.1975000],
  [39.1832900, -84.1971100],

  // === Phase 6: North along east boundary (grass — calculated from park/street boundary) ===
  // Following near Parkview Ln / eastern park edge
  [39.1842600, -84.1970100],
  [39.1849500, -84.1969500],
  [39.1850200, -84.1969600],
  [39.1850800, -84.1970000],
  [39.1853800, -84.1972500],
  [39.1855300, -84.1973100],
  [39.1859100, -84.1974900],
  [39.1862700, -84.1971100],
  [39.1870400, -84.1962900],
  [39.1871300, -84.1962100],
  [39.1871900, -84.1961700],
  [39.1872400, -84.1961600],
  [39.1872800, -84.1961700],
  [39.1873200, -84.1962000],
  [39.1873700, -84.1962400],
  [39.1877700, -84.1968800],
  [39.1877800, -84.1970400],

  // === Phase 7: Continue north to Deerwoods Dr area ===
  // Following near Deerwoods Dr / park NE boundary
  [39.1878400, -84.1972800],
  [39.1889100, -84.1971400],
  [39.1890000, -84.1971500],
  [39.1890900, -84.1972700],
  [39.1891100, -84.1976300],
  [39.1891300, -84.1979700],
  [39.1891800, -84.1992100],
  [39.1891700, -84.1993000],
  [39.1891363, -84.1993869],

  // === Phase 8: South on west service road back to finish (Way 32542887) ===
  [39.1879123, -84.199513],
  [39.186907, -84.199618],

  // === FINISH (user-provided GPS) ===
  [39.186908, -84.199125],
];

// POI Types for distinct icons
export type POIType = "start" | "parking" | "registration" | "restrooms" | "food" | "photo" | "station" | "nature" | "water";

// Points of Interest — positioned on the actual OSM trail coordinates
export const pointsOfInterest = [
  {
    id: "start",
    type: "start" as POIType,
    icon: Flag,
    label: "Start",
    description: "Miami Meadows Playground area",
    lat: 39.186930,
    lng: -84.199404,
    color: "#39B54A",
    priority: 1,
  },
  // {
  //   id: "finish",
  //   type: "finish" as POIType,
  //   icon: Flag,
  //   label: "Finish",
  //   description: "Miami Meadows Playground area",
  //   lat: 39.186930,
  //   lng: -84.199404,
  //   color: "#b53939",
  //   priority: 1,
  // },
  {
    id: "parking",
    type: "parking" as POIType,
    icon: Car,
    label: "Parking",
    description: "Main parking area",
    lat: 39.1865,
    lng: -84.1996,
    color: "#6B7280",
    priority: 2,
  },
  {
    id: "registration",
    type: "registration" as POIType,
    icon: MapPin,
    label: "Registration",
    description: "Check-in booth",
    lat: 39.1871,
    lng: -84.1996,
    color: "#29ABE2",
    priority: 1,
  },
  {
    id: "restrooms",
    type: "restrooms" as POIType,
    icon: Bath,
    label: "Restrooms",
    description: "Facilities available",
    lat: 39.1863,
    lng: -84.1996,
    color: "#6B7280",
    priority: 3,
  },
  {
    id: "food",
    type: "food" as POIType,
    icon: Utensils,
    label: "Refreshments",
    description: "Water & snacks",
    lat: 39.1867,
    lng: -84.1993,
    color: "#F26522",
    priority: 2,
  },
  {
    id: "photo",
    type: "photo" as POIType,
    icon: Camera,
    label: "Photo Zone",
    description: "Post-race photos",
    lat: 39.1868,
    lng: -84.1990,
    color: "#ED1C24",
    priority: 3,
  },
  // 8 Color Stations distributed along the 5K route
  {
    id: "station1",
    type: "station" as POIType,
    icon: Droplets,
    label: "Station 1: Family Support",
    description: "Orange color powder",
    lat: 39.1879123,
    lng: -84.199513, // West side heading north
    color: "#F26522",
    priority: 1,
  },
  {
    id: "station2",
    type: "station" as POIType,
    icon: Droplets,
    label: "Station 2: Positive Friends",
    description: "Yellow color powder",
    lat: 39.1893001,
    lng: -84.2004528, // North edge heading west
    color: "#FFC20E",
    priority: 1,
  },
  {
    id: "station3",
    type: "station" as POIType,
    icon: Droplets,
    label: "Station 3: Mentors",
    description: "Green color powder",
    lat: 39.1882290,
    lng: -84.2055593, // West side of lake
    color: "#39B54A",
    priority: 1,
  },
  {
    id: "station4",
    type: "station" as POIType,
    icon: Droplets,
    label: "Station 4: Healthy Activities",
    description: "Blue color powder",
    lat: 39.1864328,
    lng: -84.2044006, // South-west of lake
    color: "#29ABE2",
    priority: 1,
  },
  {
    id: "station5",
    type: "station" as POIType,
    icon: Droplets,
    label: "Station 5: Generosity",
    description: "Gray color powder",
    lat: 39.1857578,
    lng: -84.2013044, // South edge heading east
    color: "#808080",
    priority: 1,
  },
  {
    id: "station6",
    type: "station" as POIType,
    icon: Droplets,
    label: "Station 6: Spirituality",
    description: "Purple color powder",
    lat: 39.1835400,
    lng: -84.1985000, // South boundary of field loop
    color: "#92278F",
    priority: 1,
  },
  {
    id: "station7",
    type: "station" as POIType,
    icon: Droplets,
    label: "Station 7: Physical Health",
    description: "Light blue color powder",
    lat: 39.1862700,
    lng: -84.1971100, // East boundary heading north
    color: "#87CEEB",
    priority: 1,
  },
  {
    id: "station8",
    type: "station" as POIType,
    icon: Droplets,
    label: "Station 8: Mental Health",
    description: "Red color powder",
    lat: 39.1889100,
    lng: -84.1971400, // NE corner heading back west
    color: "#ED1C24",
    priority: 1,
  },
  {
    id: "barkpark",
    type: "nature" as POIType,
    icon: Dog,
    label: "Bark Park",
    description: "Dog park area",
    lat: 39.1895,
    lng: -84.1988,
    color: "#39B54A",
    priority: 2,
  },
  {
    id: "lake",
    type: "water" as POIType,
    icon: Waves,
    label: "Miami Meadows Lake",
    description: "Scenic lake views",
    lat: 39.1873,
    lng: -84.2040,
    color: "#29ABE2",
    priority: 2,
  },
];

const landmarks = [
  {
    icon: Flag,
    title: "Start / Finish",
    description: "Miami Meadows Playground area",
    position: "Near the parking lot with easy access",
  },
  {
    icon: TreePine,
    title: "Bark Park",
    description: "Pass by the dog park area",
    position: "Mile 1 marker",
  },
  {
    icon: Waves,
    title: "Miami Meadows Lake",
    description: "Scenic loop around the lake",
    position: "Miles 2-3",
  },
  {
    icon: MapPin,
    title: "8 Color Stations",
    description: "One for each Source of Strength",
    position: "Throughout the course",
  },
];

export function RouteMap() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [selectedPOI, setSelectedPOI] = useState<string | null>(null);

  return (
    <section
      id="route"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6 section-darker overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--sos-purple)] to-transparent opacity-30" />
        <motion.div
          className="absolute top-1/4 right-0 w-72 h-72 rounded-full bg-[var(--sos-teal)] opacity-5 blur-[100px]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm uppercase tracking-wider text-[var(--sos-teal)] mb-4">
            The Course
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            5K Route at{" "}
            <span className="gradient-text">Miami Meadows</span>
          </h2>
          <p className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto">
            A scenic 3.1-mile loop through one of Miami Township&apos;s most
            beautiful parks, featuring trails around the lake and through open
            fields.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Interactive Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden glass p-2">
              {/* Leaflet map container */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <LeafletMap
                  selectedPOI={selectedPOI}
                  onPOISelect={setSelectedPOI}
                />
              </div>

              {/* Map Legend */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.2, duration: 0.4 }}
                className="mt-3 glass rounded-lg p-3"
              >
                <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#00A651]" />
                    <span className="text-white">Start/Finish</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#00AEEF]" />
                    <span className="text-white">Registration</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Droplets size={12} className="text-[#FFC20E]" />
                    <span className="text-white">Color Stations</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-1 rounded-full bg-gradient-to-r from-[#F26522] via-[#00A651] to-[#92278F]" />
                    <span className="text-white">Route</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Decorative glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[var(--sos-teal)] to-[var(--sos-purple)] rounded-3xl opacity-10 blur-2xl -z-10" />

            {/* Instructions */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1.5 }}
              className="text-center text-xs text-[var(--foreground-muted)] mt-4"
            >
              Click markers to see details • Scroll to zoom • Drag to pan
            </motion.p>
          </motion.div>

          {/* Route Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="space-y-6">
              {/* Course stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Distance", value: "5K", sub: "3.1 miles" },
                  { label: "Terrain", value: "Flat", sub: "Paved trails" },
                  { label: "Stations", value: "8", sub: "Color stops" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                    className="glass rounded-xl p-4 text-center"
                  >
                    <span className="text-2xl font-bold gradient-text">
                      {stat.value}
                    </span>
                    <p className="text-xs text-[var(--foreground-muted)] mt-1">
                      {stat.label}
                    </p>
                    <p className="text-xs text-[var(--foreground-muted)]">
                      {stat.sub}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Landmarks */}
              <h3 className="text-xl font-bold text-white mb-4">
                Course Landmarks
              </h3>
              <div className="space-y-4">
                {landmarks.map((landmark, index) => (
                  <motion.div
                    key={landmark.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                    className="flex items-start gap-4 glass rounded-xl p-4 card-hover"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[var(--sos-teal)]/20 flex items-center justify-center flex-shrink-0">
                      <landmark.icon
                        size={20}
                        className="text-[var(--sos-teal)]"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">
                        {landmark.title}
                      </h4>
                      <p className="text-sm text-[var(--foreground-muted)]">
                        {landmark.description}
                      </p>
                      <p className="text-xs text-[var(--sos-teal)] mt-1">
                        {landmark.position}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Parking note */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 1, duration: 0.5 }}
                className="mt-6 p-4 rounded-xl border border-[var(--sos-teal)]/30 bg-[var(--sos-teal)]/5"
              >
                <p className="text-sm text-[var(--foreground-muted)]">
                  <span className="text-[var(--sos-teal)] font-semibold">
                    Parking:
                  </span>{" "}
                  Ample free parking available at Miami Meadows Park. Arrive by
                  8:30 AM for the best spots near the start/finish area.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
