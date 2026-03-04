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
  // === START ===
  [39.186930, -84.199404],

  // === Phase 1: North on service road ===
  [39.186907, -84.199618],
  [39.187912, -84.199513],
  [39.189136, -84.199387],

  // === Phase 2: West across north edge ===
  [39.189171, -84.199303],
  [39.189244, -84.199356],
  [39.189275, -84.199412],
  [39.189288, -84.199498],
  [39.189300, -84.200453],
  [39.189483, -84.204423],
  [39.189466, -84.204514],
  [39.189442, -84.204567],
  [39.189285, -84.204572],

  // === Phase 3: Lake loop — NW corner ===
  [39.189381, -84.204927],
  [39.189394, -84.205125],
  [39.189377, -84.205270],
  [39.189334, -84.205333],

  // === Lake loop — South along west side ===
  [39.189219, -84.205420],
  // TODO: Insert Mile 1 start segment (red from PDF) here
  [39.188362, -84.205559],
  [39.188229, -84.205559],
  [39.188171, -84.205506],
  [39.188121, -84.205398],
  [39.188113, -84.205130],
  [39.188079, -84.205001],
  [39.187996, -84.204916],
  [39.187580, -84.204776],
  [39.187323, -84.204722],
  [39.187106, -84.204679],
  [39.186849, -84.204594],

  // === Lake loop — East along south edge ===
  [39.186433, -84.204401],
  [39.186358, -84.204401],
  [39.186193, -84.204432],
  [39.186075, -84.204454],
  [39.185992, -84.204444],
  [39.185959, -84.204358],
  [39.185934, -84.204283],
  [39.185758, -84.201304],
  [39.185722, -84.200601],
  [39.185643, -84.199828],

  // === Phase 4: South along service road ===
  [39.185636, -84.199742],
  [39.185616, -84.199466],
  [39.185599, -84.199004],
  [39.185589, -84.198910],
  [39.185587, -84.198747],
  [39.185581, -84.198615],
  [39.185575, -84.198478],
  [39.185568, -84.198363],
  [39.185556, -84.198151],
  [39.185545, -84.197902],

  // === Phase 5: SE corner curve into east perimeter ===
  [39.185604, -84.197709],
  [39.185708, -84.197593],
  [39.185909, -84.197489],

  // === Phase 6: North along east perimeter ===
  [39.186117, -84.197475],
  [39.186248, -84.197454],
  [39.186385, -84.197443],
  [39.186570, -84.197416],
  [39.186739, -84.197395],
  [39.187210, -84.197336],
  [39.187755, -84.197274],
  [39.188589, -84.197175],
  [39.188747, -84.197163],
  [39.188998, -84.197139],

  // === Phase 7: NE corner — west to rejoin main road ===
  [39.189051, -84.197207],
  [39.189050, -84.197200],
  [39.189100, -84.197400],
  [39.189150, -84.197800],
  [39.189180, -84.198400],
  [39.189200, -84.199000],
  [39.189180, -84.199210],
  [39.189136, -84.199387],

  // === Phase 8: South on service road back to finish ===
  [39.187912, -84.199513],
  [39.186907, -84.199618],

  // === FINISH ===
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
    lat: 39.1838000,
    lng: -84.1986000, // South boundary
    color: "#92278F",
    priority: 1,
  },
  {
    id: "station7",
    type: "station" as POIType,
    icon: Droplets,
    label: "Station 7: Physical Health",
    description: "Light blue color powder",
    lat: 39.1865000,
    lng: -84.1972000, // East perimeter heading north
    color: "#87CEEB",
    priority: 1,
  },
  {
    id: "station8",
    type: "station" as POIType,
    icon: Droplets,
    label: "Station 8: Mental Health",
    description: "Red color powder",
    lat: 39.1889000,
    lng: -84.1971000, // NE corner heading back west
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
