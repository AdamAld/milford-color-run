"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { HandHeart, Users, Clock, Gift, Mail } from "lucide-react";

const volunteerRoles = [
  {
    title: "Color Station Crew",
    description: "Spread joy (and color!) at our vibrant stations",
    icon: "🎨",
  },
  {
    title: "Registration Table",
    description: "Welcome runners and distribute race materials",
    icon: "📋",
  },
  {
    title: "Course Marshals",
    description: "Guide and cheer on participants along the route",
    icon: "🏃",
  },
  {
    title: "Setup & Cleanup",
    description: "Help prepare before and clean up after the event",
    icon: "🛠️",
  },
];

const benefits = [
  {
    icon: Gift,
    title: "Volunteer Button",
    description: "Receive an exclusive volunteer button",
  },
  {
    icon: Clock,
    title: "Service Hours",
    description: "Earn community service hours",
  },
  {
    icon: Users,
    title: "Make Friends",
    description: "Connect with fellow community members",
  },
  {
    icon: HandHeart,
    title: "Make a Difference",
    description: "Support mental health in your community",
  },
];

export function Volunteer() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="volunteer"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6 section-dark"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-[var(--color-green)] opacity-5 blur-[100px]"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-sm uppercase tracking-wider text-[var(--sos-teal)] mb-4">
              Get Involved
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Volunteer With{" "}
              <span className="gradient-text">Us</span>
            </h2>
            <p className="text-lg text-[var(--foreground-muted)] mb-8">
              Be part of something colorful! We need enthusiastic volunteers to
              help make this event a success. Whether you can help for an hour
              or the whole day, we&apos;d love to have you on our team.
            </p>

            {/* Volunteer Benefits */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-[var(--sos-teal)]/20 flex items-center justify-center flex-shrink-0">
                    <benefit.icon size={20} className="text-[var(--sos-teal)]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">
                      {benefit.title}
                    </h4>
                    <p className="text-xs text-[var(--foreground-muted)]">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.a
              href="mailto:gray_c@milfordschools.org?subject=Color Run Volunteer Interest"
              className="inline-flex items-center gap-2 gradient-button px-8 py-4 rounded-full text-lg font-semibold text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center gap-2">
                <Mail size={20} />
                Sign Up to Volunteer
              </span>
            </motion.a>
          </motion.div>

          {/* Right Column - Roles */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="glass rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-bold text-white mb-6">
                Volunteer Roles
              </h3>
              <div className="space-y-4">
                {volunteerRoles.map((role, index) => (
                  <motion.div
                    key={role.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-[var(--background-tertiary)] hover:bg-[var(--background-secondary)] transition-colors"
                  >
                    <span className="text-2xl">{role.icon}</span>
                    <div>
                      <h4 className="font-semibold text-white">{role.title}</h4>
                      <p className="text-sm text-[var(--foreground-muted)]">
                        {role.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-sm text-[var(--foreground-muted)]">
                  <span className="text-[var(--sos-teal)]">Note:</span> Volunteers
                  should arrive by 8:30 AM for briefing. All ages welcome (under
                  16 must be accompanied by an adult).
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
