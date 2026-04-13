"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink, Users, QrCode, Clock, Shirt, Check } from "lucide-react";
import Image from "next/image";
import { track } from "@/lib/analytics";

const REGISTRATION_URL = "https://www.locallevelevents.com/events/details/44011";

const EARLY_BIRD_DEADLINE = new Date("2026-03-31T23:59:59");

function getDaysUntilDeadline(): number {
  const now = new Date();
  const diff = EARLY_BIRD_DEADLINE.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function Registration() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const handleRegisterClick = () => {
    track("registration_external_click", {
      destination: REGISTRATION_URL,
      location: "registration_section",
    });
    window.open(REGISTRATION_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="register"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6 overflow-hidden"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-[var(--background-secondary)] to-[var(--background)]" />

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[var(--sos-teal)] opacity-10 blur-[120px]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[var(--sos-purple)] opacity-10 blur-[120px]"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm uppercase tracking-wider text-[var(--sos-teal)] mb-4">
            Sign Up Today
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Register for the{" "}
            <span className="gradient-text">Color Run</span>
          </h2>
          <p className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto">
            Secure your spot and join hundreds of students, families, and
            community members for the most colorful event of the year!
          </p>
        </motion.div>

        {/* Early Bird Urgency Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mb-10"
        >
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-6 py-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
            <Clock size={20} className="text-amber-400 flex-shrink-0" />
            <p className="text-amber-400 font-semibold">
              Only <span className="text-white">{getDaysUntilDeadline()} days</span> left to get Early Bird pricing — register by March 31!
            </p>
          </div>
        </motion.div>

        {/* Pricing Comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Early Bird */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative glass rounded-2xl p-8 border-2 border-[var(--sos-teal)]"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="gradient-button px-4 py-1 rounded-full text-sm font-semibold text-white">
                <span>Best Value</span>
              </span>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Early Bird</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-bold text-[var(--sos-teal)]">$20</span>
                <span className="text-[var(--foreground-muted)]">/person</span>
              </div>
              <p className="text-sm text-amber-400 font-medium mt-2">
                Register by March 31
              </p>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-3 text-[var(--foreground-muted)]">
                <Shirt size={18} className="text-[var(--sos-teal)] flex-shrink-0" />
                <span><span className="text-white font-medium">Event t-shirt included</span> — only available with Early Bird</span>
              </li>
              <li className="flex items-center gap-3 text-[var(--foreground-muted)]">
                <Check size={18} className="text-[var(--sos-teal)] flex-shrink-0" />
                Color powder packets at each station
              </li>
              <li className="flex items-center gap-3 text-[var(--foreground-muted)]">
                <Check size={18} className="text-[var(--sos-teal)] flex-shrink-0" />
                Save $5 vs. regular registration
              </li>
            </ul>
          </motion.div>

          {/* Regular */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="glass rounded-2xl p-8 opacity-80"
          >
            <div className="text-center mb-6 pt-4">
              <h3 className="text-xl font-bold text-white mb-2">Regular</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-bold text-[var(--sos-purple)]">$25</span>
                <span className="text-[var(--foreground-muted)]">/person</span>
              </div>
              <p className="text-sm text-[var(--foreground-muted)] mt-2">
                After April 1
              </p>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-3 text-[var(--foreground-muted)]">
                <Check size={18} className="text-[var(--sos-purple)] flex-shrink-0" />
                Color powder packets at each station
              </li>
              <li className="flex items-center gap-3 text-[var(--foreground-muted)] line-through opacity-50">
                <Shirt size={18} className="flex-shrink-0" />
                No t-shirt included
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Registration Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="glass rounded-2xl p-8 md:p-12 mb-12"
        >
          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Left: CTA */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-3">
                Ready to Run?
              </h3>
              <p className="text-[var(--foreground-muted)] mb-6">
                Registration is handled through Local Level Events. Click below
                to complete your sign-up, pick your t-shirt size, and lock in
                your spot before Early Bird pricing ends.
              </p>

              <motion.button
                onClick={handleRegisterClick}
                className="gradient-button px-8 py-4 rounded-xl text-lg font-semibold text-white transition-all inline-flex items-center gap-3"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="inline-flex items-center gap-3">
                  Register Now
                  <ExternalLink size={20} />
                </span>
              </motion.button>

              <p className="text-xs text-[var(--foreground-muted)] mt-4">
                You&apos;ll be redirected to Local Level Events to complete registration.
              </p>
            </div>

            {/* Right: QR Code */}
            <div className="flex-shrink-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="glass rounded-2xl p-6 text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-3">
                  <QrCode size={18} className="text-[var(--sos-teal)]" />
                  <span className="text-sm font-medium text-white">Scan to Register</span>
                </div>
                <div className="bg-white rounded-xl p-3 inline-block">
                  <Image
                    src="/registration-qr.svg"
                    alt="QR code to register for the Color Run"
                    width={180}
                    height={180}
                    className="block"
                  />
                </div>
                <p className="text-xs text-[var(--foreground-muted)] mt-3 max-w-[200px]">
                  Point your phone&apos;s camera at the code
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Group Registration Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 glass px-6 py-3 rounded-full">
            <Users size={18} className="text-[var(--sos-teal)]" />
            <span className="text-sm text-[var(--foreground-muted)]">
              Registering a group of 10+?{" "}
              <a
                href="mailto:gray_c@milfordschools.org"
                className="text-[var(--sos-teal)] hover:underline"
              >
                Contact us for group rates
              </a>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
