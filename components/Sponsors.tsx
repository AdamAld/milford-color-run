"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Award, Medal, Heart, Mail } from "lucide-react";

const sponsorTiers = [
  {
    name: "Platinum",
    icon: Star,
    color: "var(--color-yellow)",
    slots: 2,
    benefits: ["Logo on t-shirts", "Banner at start/finish", "Social media features"],
  },
  {
    name: "Gold",
    icon: Award,
    color: "var(--sos-teal)",
    slots: 4,
    benefits: ["Logo on website", "Banner at event", "Social media mention"],
  },
  {
    name: "Silver",
    icon: Medal,
    color: "var(--foreground-muted)",
    slots: 6,
    benefits: ["Logo on website", "Recognition at event"],
  },
  {
    name: "Community",
    icon: Heart,
    color: "var(--color-pink)",
    slots: 10,
    benefits: ["Logo on website", "Our gratitude!"],
  },
];

export function Sponsors() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="sponsors"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6 section-darker"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--sos-teal)] to-transparent opacity-30" />
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
            Our Partners
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Thank You to Our{" "}
            <span className="gradient-text">Sponsors</span>
          </h2>
          <p className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto">
            This event is made possible by the generous support of local
            businesses and community members who believe in mental health
            awareness.
          </p>
        </motion.div>

        {/* Sponsor Tiers */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {sponsorTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
              className="glass rounded-2xl p-6 text-center"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: `${tier.color}20` }}
              >
                <tier.icon size={28} style={{ color: tier.color }} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{tier.name}</h3>
              <p className="text-sm text-[var(--foreground-muted)] mb-4">
                {tier.slots} spots available
              </p>

              {/* Placeholder sponsor logos */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {Array.from({ length: Math.min(tier.slots, 4) }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[3/2] rounded-lg bg-[var(--background-tertiary)] flex items-center justify-center"
                  >
                    <span className="text-xs text-[var(--foreground-muted)]">
                      Logo
                    </span>
                  </div>
                ))}
              </div>

              <ul className="text-left space-y-1">
                {tier.benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="text-xs text-[var(--foreground-muted)] flex items-start gap-2"
                  >
                    <span style={{ color: tier.color }}>•</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Become a Sponsor CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="glass rounded-2xl p-8 md:p-10 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Interested in Sponsoring?
          </h3>
          <p className="text-[var(--foreground-muted)] mb-6 max-w-2xl mx-auto">
            Support mental health awareness in our community while gaining
            visibility for your business. Contact us to learn more about
            sponsorship opportunities.
          </p>
          <motion.a
            href="mailto:gray_c@milfordschools.org?subject=Color Run Sponsorship Inquiry"
            className="inline-flex items-center gap-2 gradient-button px-8 py-4 rounded-full text-lg font-semibold text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex items-center gap-2">
              <Mail size={20} />
              Become a Sponsor
            </span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
