"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Heart, Users, Sparkles } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Support Mental Health",
    description:
      "Every registration supports Sources of Strength's mission to promote mental wellness and build protective factors in our school community.",
    color: "var(--color-pink)",
  },
  {
    icon: Users,
    title: "Join Your Community",
    description:
      "Connect with fellow students, families, and community members in a fun, supportive environment that celebrates togetherness.",
    color: "var(--sos-teal)",
  },
  {
    icon: Sparkles,
    title: "Celebrate in Color",
    description:
      "Experience the joy of being showered in vibrant, safe color powder at every kilometer. It's not a race—it's a celebration!",
    color: "var(--color-yellow)",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6 section-darker"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--sos-teal)] to-transparent opacity-30" />
        <div className="absolute -top-32 right-1/4 w-64 h-64 rounded-full bg-[var(--sos-purple)] opacity-10 blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-block text-sm uppercase tracking-wider text-[var(--sos-teal)] mb-4"
          >
            About The Event
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            More Than Just a{" "}
            <span className="gradient-text">Fun Run</span>
          </h2>
          <p className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto">
            Organized by Milford High School&apos;s Sources of Strength,
            this Color Run 5K is a student-led initiative to spread joy while
            raising awareness for mental health in our community.
          </p>
        </motion.div>

        {/* What is Sources of Strength */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="glass rounded-2xl p-8 md:p-10 mb-16"
        >
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-4">
                What is Sources of Strength?
              </h3>
              <p className="text-[var(--foreground-muted)] leading-relaxed mb-4">
                Sources of Strength is a best-practice youth suicide prevention
                project designed to harness the power of peer social networks to
                change unhealthy norms and culture, ultimately preventing suicide,
                bullying, and substance abuse.
              </p>
              <p className="text-[var(--foreground-muted)] leading-relaxed">
                At Milford High School, our peer leaders work to spread hope,
                help, and strength by connecting students to positive adults
                and resources. This Color Run is one of many ways we bring our
                community together.
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="relative w-48 h-48 md:w-64 md:h-64">
                {/* Decorative rings */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-[var(--sos-teal)] opacity-30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-4 rounded-full border-2 border-[var(--sos-purple)] opacity-30"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-8 rounded-full border-2 border-[var(--color-pink)] opacity-30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="block text-5xl font-bold gradient-text">SOS</span>
                    <span className="text-xs text-[var(--foreground-muted)]">Sources of Strength</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="glass rounded-2xl p-8 card-hover group"
            >
              <motion.div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                style={{ backgroundColor: `${feature.color}20` }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <feature.icon
                  size={28}
                  style={{ color: feature.color }}
                />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[var(--sos-teal)] transition-colors">
                {feature.title}
              </h3>
              <p className="text-[var(--foreground-muted)] leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
