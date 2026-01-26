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
  Bath,
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
// Lake location: 39.187558, -84.202223
export const PARK_CENTER = {
  lat: 39.1876,
  lng: -84.2022,
};

// 5K Route coordinates based on actual Miami Meadows 5K course
// Start/Finish near Miami Meadows Playground on east side
// Route: East start -> South -> West along south edge -> North on west side ->
//        East along north (past Bark Park) -> South back to start
export const routeCoordinates: [number, number][] = [
  // Start/Finish - East side near Miami Meadows Playground
  [39.1858, -84.1970], // Start/Finish near playground

  // Head south then west along south edge (Mile 1 - red)
  [39.1850, -84.1975], // South from start
  [39.1845, -84.1990], // Continue southwest
  [39.1842, -84.2010], // South edge
  [39.1840, -84.2030], // Continue west
  [39.1842, -84.2050], // Southwest corner

  // North along west side - Wade Rd area (Mile 2 - blue)
  [39.1855, -84.2060], // West side heading north
  [39.1870, -84.2065], // Continue north along west
  [39.1885, -84.2060], // Northwest area near lake
  [39.1895, -84.2050], // Continue north

  // East along north edge past Bark Park (Mile 3 - yellow)
  [39.1905, -84.2035], // North side
  [39.1908, -84.2015], // Continue east on north edge
  [39.1905, -84.1995], // Near Bark Park
  [39.1898, -84.1980], // Northeast area

  // South on east side back to start (Final stretch)
  [39.1888, -84.1970], // East side heading south
  [39.1875, -84.1968], // Continue south
  [39.1865, -84.1968], // Near finish
  [39.1858, -84.1970], // Return to Start/Finish
];

// POI Types for distinct icons
export type POIType = "start" | "parking" | "registration" | "restrooms" | "food" | "photo" | "station" | "nature" | "water";

// Points of Interest - positioned based on actual Miami Meadows 5K course
// Start/Finish near Miami Meadows Playground on east side
export const pointsOfInterest = [
  {
    id: "start",
    type: "start" as POIType,
    icon: Flag,
    label: "Start/Finish",
    description: "Miami Meadows Playground area",
    lat: 39.1858,
    lng: -84.1970, // East side near playground
    color: "#39B54A", // SOS Green (Mentors)
    priority: 1,
  },
  {
    id: "parking",
    type: "parking" as POIType,
    icon: Car,
    label: "Parking",
    description: "Main parking area",
    lat: 39.1855,
    lng: -84.1965, // Near playground
    color: "#6B7280",
    priority: 2,
  },
  {
    id: "registration",
    type: "registration" as POIType,
    icon: MapPin,
    label: "Registration",
    description: "Check-in booth",
    lat: 39.1862,
    lng: -84.1972, // Near start
    color: "#29ABE2", // SOS Blue (Healthy Activities)
    priority: 1,
  },
  {
    id: "restrooms",
    type: "restrooms" as POIType,
    icon: Bath,
    label: "Restrooms",
    description: "Facilities available",
    lat: 39.1852,
    lng: -84.1968, // Near parking/playground
    color: "#6B7280",
    priority: 3,
  },
  {
    id: "food",
    type: "food" as POIType,
    icon: Utensils,
    label: "Refreshments",
    description: "Water & snacks",
    lat: 39.1860,
    lng: -84.1965, // Near finish area
    color: "#F26522", // SOS Orange (Family Support)
    priority: 2,
  },
  {
    id: "photo",
    type: "photo" as POIType,
    icon: Camera,
    label: "Photo Zone",
    description: "Post-race photos",
    lat: 39.1856,
    lng: -84.1975, // Near finish
    color: "#ED1C24", // SOS Red (Mental Health)
    priority: 3,
  },
  // 8 Color Stations distributed around the full 5K course
  {
    id: "station1",
    type: "station" as POIType,
    icon: Droplets,
    label: "Station 1: Family Support",
    description: "Orange color powder",
    lat: 39.1845,
    lng: -84.2000, // Mile 1 area - south section
    color: "#F26522", // Orange
    priority: 1,
  },
  {
    id: "station2",
    type: "station" as POIType,
    icon: Droplets,
    label: "Station 2: Positive Friends",
    description: "Yellow color powder",
    lat: 39.1842,
    lng: -84.2040, // Southwest corner
    color: "#FFC20E", // Yellow
    priority: 1,
  },
  {
    id: "station3",
    type: "station" as POIType,
    icon: Droplets,
    label: "Station 3: Mentors",
    description: "Green color powder",
    lat: 39.1865,
    lng: -84.2062, // West side - Mile 2 area
    color: "#39B54A", // Green
    priority: 1,
  },
  {
    id: "station4",
    type: "station" as POIType,
    icon: Droplets,
    label: "Station 4: Healthy Activities",
    description: "Blue color powder",
    lat: 39.1890,
    lng: -84.2055, // Northwest near lake
    color: "#29ABE2", // Blue
    priority: 1,
  },
  {
    id: "station5",
    type: "station" as POIType,
    icon: Droplets,
    label: "Station 5: Generosity",
    description: "Gray color powder",
    lat: 39.1905,
    lng: -84.2025, // North side - Mile 3 area
    color: "#808080", // Gray
    priority: 1,
  },
  {
    id: "station6",
    type: "station" as POIType,
    icon: Droplets,
    label: "Station 6: Spirituality",
    description: "Purple color powder",
    lat: 39.1905,
    lng: -84.1995, // North side near Bark Park
    color: "#92278F", // Purple
    priority: 1,
  },
  {
    id: "station7",
    type: "station" as POIType,
    icon: Droplets,
    label: "Station 7: Physical Health",
    description: "Light blue color powder",
    lat: 39.1895,
    lng: -84.1978, // Northeast area
    color: "#87CEEB", // Light Blue
    priority: 1,
  },
  {
    id: "station8",
    type: "station" as POIType,
    icon: Droplets,
    label: "Station 8: Mental Health",
    description: "Red color powder",
    lat: 39.1878,
    lng: -84.1970, // East side near finish
    color: "#ED1C24", // Red
    priority: 1,
  },
  {
    id: "barkpark",
    type: "nature" as POIType,
    icon: TreePine,
    label: "Bark Park",
    description: "Dog park area",
    lat: 39.1902,
    lng: -84.1988, // Northeast area per reference map
    color: "#39B54A", // Green
    priority: 2,
  },
  {
    id: "lake",
    type: "water" as POIType,
    icon: Waves,
    label: "Miami Meadows Lake",
    description: "Scenic lake views",
    lat: 39.1878,
    lng: -84.2045, // Northwest area of park
    color: "#29ABE2", // Blue
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
