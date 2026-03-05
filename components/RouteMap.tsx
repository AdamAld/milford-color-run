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

// 5K Route — full continuous path from start to finish.
// Leg boundaries are defined separately for coloring.
export const routeCoordinates: [number, number][] = [
  // === START (near playground) ===
  [39.186959, -84.199238],

  // === East connector to east perimeter ===
  [39.186891, -84.197552],
  [39.186894, -84.197497],
  [39.186907, -84.197435],
  [39.186930, -84.197400],
  [39.186956, -84.197376],
  [39.186981, -84.197367],

  // === North along east perimeter ===
  [39.187210, -84.197336],
  [39.187755, -84.197274],
  [39.188589, -84.197175],
  [39.188747, -84.197163],
  [39.188976, -84.197148],

  // === NE corner — curving west ===
  [39.188995, -84.197137],
  [39.189022, -84.197174],
  [39.189052, -84.197212],
  [39.189070, -84.197241],
  [39.189092, -84.197267],
  [39.189097, -84.197373],
  [39.189097, -84.197495],
  [39.189125, -84.197855],
  [39.189143, -84.198173],
  [39.189157, -84.198488],
  [39.189164, -84.198791],
  [39.189178, -84.199051],
  [39.189184, -84.199173],
  [39.189181, -84.199229],
  [39.189174, -84.199284],
  [39.189172, -84.199307],

  // === West along north edge ===
  [39.189205, -84.199335],
  [39.189241, -84.199356],
  [39.189275, -84.199412],
  [39.189286, -84.199496],
  [39.189295, -84.199891],
  [39.189308, -84.200479],
  [39.189483, -84.204412],
  [39.189465, -84.204515],
  [39.189446, -84.204570],
  [39.189290, -84.204574],

  // === Lake loop — NW corner ===
  [39.189382, -84.204926],
  [39.189396, -84.205125],
  [39.189379, -84.205270],
  [39.189330, -84.205336],

  // === Lake loop — South along west side ===
  [39.189220, -84.205421],
  [39.188364, -84.205561],
  [39.188236, -84.205564],
  [39.188176, -84.205513],
  [39.188121, -84.205399],
  [39.188113, -84.205126],
  [39.188077, -84.205002],
  [39.187997, -84.204916],
  [39.187590, -84.204782],
  [39.187110, -84.204684],
  [39.186852, -84.204599],

  // === Lake loop — East along south edge ===
  [39.186433, -84.204399],
  [39.186360, -84.204399],
  [39.186075, -84.204457],
  [39.185996, -84.204446],
  [39.185957, -84.204377],
  [39.185955, -84.204253],
  [39.185934, -84.203706],

  // === Continue east from lake toward service road ===
  [39.185758, -84.201304],
  [39.185722, -84.200601],
  [39.185643, -84.199828],

  // === South along service road ===
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

  // === SE corner curve into east perimeter ===
  [39.185604, -84.197709],
  [39.185708, -84.197593],
  [39.185909, -84.197489],

  // === North along east perimeter (overlap) ===
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

  // === NE corner — west (overlap, pass 2) ===
  [39.189092, -84.197269],
  [39.189106, -84.197607],
  [39.189124, -84.197859],
  [39.189145, -84.198200],
  [39.189171, -84.198886],
  [39.189186, -84.199174],
  [39.189183, -84.199229],
  [39.189172, -84.199305],

  // === West along north edge (overlap, pass 2) ===
  [39.189244, -84.199357],
  [39.189274, -84.199413],
  [39.189288, -84.199496],
  [39.189301, -84.200494],
  [39.189423, -84.203139],
  [39.189483, -84.204409],
  [39.189466, -84.204513],
  [39.189441, -84.204568],
  [39.189284, -84.204570],

  // === Lake loop NW corner (overlap, pass 2) ===
  [39.189383, -84.204925],
  [39.189396, -84.205128],
  [39.189377, -84.205267],
  [39.189332, -84.205334],

  // === Lake west side top (Leg 2 ends here) ===
  [39.189218, -84.205423],
  [39.189172, -84.205431],

  // =============================================
  // === LEG 3 (user-traced) ===
  // =============================================

  // Lake loop — west side descent (pass 2)
  [39.188369, -84.205558],
  [39.188235, -84.205564],
  [39.188177, -84.205514],
  [39.188121, -84.205397],
  [39.188113, -84.205126],
  [39.188076, -84.205002],
  [39.187998, -84.204914],
  [39.187581, -84.204779],
  [39.187115, -84.204684],
  [39.186850, -84.204599],

  // Lake loop — south edge (pass 2)
  [39.186434, -84.204401],
  [39.186360, -84.204401],
  [39.186079, -84.204457],
  [39.185997, -84.204448],
  [39.185932, -84.204291],

  // East from lake (pass 2)
  [39.185720, -84.200571],
  [39.185636, -84.199739],

  // SE corner + north on east perimeter (pass 3)
  [39.185541, -84.197910],
  [39.185601, -84.197707],
  [39.185703, -84.197591],
  [39.185908, -84.197491],
  [39.187577, -84.197288],
  [39.188911, -84.197137],
  [39.189000, -84.197147],

  // NE corner west (pass 3)
  [39.189094, -84.197267],
  [39.189105, -84.197638],
  [39.189136, -84.197969],
  [39.189185, -84.199211],
  [39.189171, -84.199306],
  [39.189138, -84.199385],

  // Leg 3 ends — mid service road
  [39.188671, -84.199435],

  // =============================================
  // === LEG 4 (user-traced) ===
  // =============================================

  // South on service road to finish
  [39.187030, -84.199602],
  [39.186991, -84.199584],
  [39.186974, -84.199538],

  // === FINISH ===
  [39.186967, -84.199409],
];

// Leg boundaries — index into routeCoordinates where each leg ends.
// Used for coloring segments. Traced by user on the debug editor.
export const legBoundaries = {
  leg1End: 59,  // [39.185934, -84.203706] — lake south edge
  leg2End: 108, // [39.189172, -84.205431] — lake west side top (pass 2)
  leg3End: 139, // [39.188671, -84.199435] — mid service road
  // leg4 runs from leg3End to the end (index 140 = finish)
};

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
    lat: 39.186959,
    lng: -84.199238,
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
    lat: 39.1856000,
    lng: -84.1990000, // South service road
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
