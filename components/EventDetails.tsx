"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Shirt,
  Music,
  Camera,
  Droplets,
  Utensils,
} from "lucide-react";

const eventInfo = [
  {
    icon: Calendar,
    label: "Date",
    value: "Saturday, May 2, 2026",
    color: "var(--color-pink)",
  },
  {
    icon: Clock,
    label: "Schedule",
    value: "9 AM Registration",
    subValue: "10 AM Race Start",
    color: "var(--sos-teal)",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Miami Meadows Park",
    subValue: "1546 State Route 131, Milford, OH",
    color: "var(--color-yellow)",
  },
];

const included = [
  {
    icon: Shirt,
    title: "Event T-Shirt",
    description: "Early Bird registration only (before April 1)",
    color: "var(--color-pink)",
  },
  {
    icon: Camera,
    title: "Photo Ops",
    description: "Capture colorful memories",
    color: "var(--sos-teal)",
  },
  {
    icon: Utensils,
    title: "Refreshments",
    description: "Water and snacks at finish",
    color: "var(--color-orange)",
  },
];

// Sources of Strength 8 Core Strengths - Official SOS Wheel Colors (Verified)
const strengthStations = [
  {
    strength: "Family Support",
    description: "The support from family members",
    color: "#F26522", // Orange
  },
  {
    strength: "Positive Friends",
    description: "Healthy friendships that support you",
    color: "#FFC20E", // Yellow
  },
  {
    strength: "Mentors",
    description: "Adults who guide and support you",
    color: "#39B54A", // Green
  },
  {
    strength: "Healthy Activities",
    description: "Activities that bring joy and meaning",
    color: "#29ABE2", // Blue
  },
  {
    strength: "Generosity",
    description: "Giving back to others",
    color: "#808080", // Gray
  },
  {
    strength: "Spirituality",
    description: "Faith, purpose, and meaning",
    color: "#92278F", // Purple
  },
  {
    strength: "Physical Health",
    description: "Taking care of your body",
    color: "#87CEEB", // Light Blue
  },
  {
    strength: "Mental Health",
    description: "Emotional well-being and resilience",
    color: "#ED1C24", // Red
  },
];

export function EventDetails() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="details"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6 section-dark"
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 -left-64 w-96 h-96 rounded-full bg-[var(--color-green)] opacity-5 blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[var(--color-orange)] opacity-5 blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm uppercase tracking-wider text-[var(--sos-teal)] mb-4">
            Event Information
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Everything You Need to{" "}
            <span className="gradient-text">Know</span>
          </h2>
        </motion.div>

        {/* Event Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          {eventInfo.map((info, index) => (
            <motion.div
              key={info.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
              className="glass rounded-2xl p-6 text-center card-hover"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: `${info.color}20` }}
              >
                <info.icon size={28} style={{ color: info.color }} />
              </div>
              <span className="text-sm text-[var(--foreground-muted)] uppercase tracking-wider">
                {info.label}
              </span>
              <p className="text-xl font-bold text-white mt-1">{info.value}</p>
              {info.subValue && (
                <p className="text-sm text-[var(--foreground-muted)] mt-1">
                  {info.subValue}
                </p>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* What's Included */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-white mb-8 text-center">
            What&apos;s Included
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {included.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                className="glass rounded-xl p-5 flex items-start gap-4 card-hover"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <item.icon size={20} style={{ color: item.color }} />
                </div>
                <div>
                  <h4 className="font-semibold text-white">{item.title}</h4>
                  <p className="text-sm text-[var(--foreground-muted)]">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sources of Strength Color Stations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="glass rounded-2xl p-8 md:p-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <Droplets className="text-[var(--sos-teal)]" size={28} />
            <h3 className="text-2xl font-bold text-white">
              Strength Stations
            </h3>
          </div>
          <p className="text-[var(--foreground-muted)] mb-4">
            Each color station represents one of the{" "}
            <span className="text-[var(--sos-teal)] font-semibold">
              8 Sources of Strength
            </span>
            —the protective factors that help build resilience and well-being.
          </p>
          <p className="text-sm text-[var(--foreground-muted)] mb-8">
            Get showered in vibrant, safe, washable color powder at each station
            as you celebrate these core strengths!
          </p>

          {/* Strength wheel display */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
            {strengthStations.map((station, index) => (
              <motion.div
                key={station.strength}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.7 + index * 0.08, duration: 0.4 }}
                className="group relative"
              >
                <div className="glass rounded-xl p-4 text-center card-hover h-full flex flex-col items-center">
                  {/* Color circle */}
                  <motion.div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3 shadow-lg"
                    style={{
                      backgroundColor: station.color,
                      boxShadow: `0 0 20px ${station.color}40`,
                    }}
                    whileHover={{ scale: 1.15 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {index + 1}
                  </motion.div>

                  {/* Strength name */}
                  <h4 className="font-semibold text-white text-sm mb-1">
                    {station.strength}
                  </h4>

                  {/* Description - shows on hover */}
                  <p className="text-xs text-[var(--foreground-muted)] opacity-0 group-hover:opacity-100 transition-opacity">
                    {station.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* SOS Wheel Reference */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="mt-8 pt-6 border-t border-white/10 text-center"
          >
            <p className="text-xs text-[var(--foreground-muted)]">
              Colors inspired by the{" "}
              <span className="text-[var(--sos-teal)]">
                Sources of Strength Wheel
              </span>
              —8 protective factors that help prevent suicide, bullying, and
              substance abuse.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
