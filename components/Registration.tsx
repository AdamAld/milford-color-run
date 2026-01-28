"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, ArrowRight, Users, Smartphone } from "lucide-react";
import { RegistrationForm } from "./RegistrationForm";

const pricingTiers = [
  {
    name: "Early Bird",
    price: "$20",
    deadline: "Ends April 1, 2026",
    description: "Best value - register early!",
    features: [
      "Event t-shirt",
      "Color powder packets",
      "Post-race celebration access",
      "Commemorative bib number",
    ],
    popular: true,
    color: "var(--sos-teal)",
  },
  {
    name: "Regular",
    price: "$25",
    deadline: "April 2 - May 1, 2026",
    description: "Standard registration",
    features: [
      "Event t-shirt",
      "Color powder packets",
      "Post-race celebration access",
      "Commemorative bib number",
    ],
    popular: false,
    color: "var(--sos-purple)",
  },
];

const steps = [
  {
    step: 1,
    title: "Register Online",
    description: "Fill out the registration form with your details",
    icon: Users,
  },
  {
    step: 2,
    title: "Pay via Venmo",
    description: "Send payment to our Venmo account",
    icon: Smartphone,
  },
  {
    step: 3,
    title: "Get Confirmation",
    description: "Receive email confirmation and event details",
    icon: Check,
  },
];

export function Registration() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

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

      <div className="max-w-6xl mx-auto relative z-10">
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

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + index * 0.15, duration: 0.6 }}
              className={`relative rounded-2xl p-8 ${
                tier.popular
                  ? "glass border-2 border-[var(--sos-teal)]"
                  : "glass"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="gradient-button px-4 py-1 rounded-full text-sm font-semibold text-white">
                    <span>Best Value</span>
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {tier.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span
                    className="text-5xl font-bold"
                    style={{ color: tier.color }}
                  >
                    {tier.price}
                  </span>
                  <span className="text-[var(--foreground-muted)]">
                    /person
                  </span>
                </div>
                <p className="text-sm text-[var(--foreground-muted)] mt-2">
                  {tier.deadline}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-[var(--foreground-muted)]"
                  >
                    <Check
                      size={18}
                      style={{ color: tier.color }}
                      className="flex-shrink-0"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <motion.a
                href="#registration-form"
                className={`block w-full py-4 rounded-xl text-center font-semibold transition-all ${
                  tier.popular
                    ? "gradient-button text-white"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("registration-form")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  Register Now <ArrowRight size={18} />
                </span>
              </motion.a>
            </motion.div>
          ))}
        </div>

        {/* How to Register */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="glass rounded-2xl p-8 md:p-10 mb-16"
        >
          <h3 className="text-2xl font-bold text-white mb-8 text-center">
            How to Register
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                className="relative text-center"
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-[var(--sos-teal)] to-[var(--sos-purple)] opacity-30" />
                )}

                <div className="w-16 h-16 rounded-full gradient-button mx-auto mb-4 flex items-center justify-center">
                  <step.icon size={28} className="text-white relative z-10" />
                </div>
                <span className="text-xs text-[var(--sos-teal)] uppercase tracking-wider">
                  Step {step.step}
                </span>
                <h4 className="text-lg font-bold text-white mt-1 mb-2">
                  {step.title}
                </h4>
                <p className="text-sm text-[var(--foreground-muted)]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Registration Form */}
        <motion.div
          id="registration-form"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="max-w-2xl mx-auto mb-16 scroll-mt-24"
        >
          <RegistrationForm />
        </motion.div>

        {/* Venmo Payment Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex flex-col items-center glass rounded-2xl p-8">
            <Smartphone
              size={48}
              className="text-[var(--sos-teal)] mb-4"
            />
            <h3 className="text-xl font-bold text-white mb-2">
              Payment via Venmo
            </h3>
            <p className="text-[var(--foreground-muted)] mb-4 max-w-md">
              After completing your registration form, send payment to our
              Venmo account. Include <span className="text-white font-semibold">SOS Color Run</span> and your name in the payment note.
            </p>
            <div className="glass rounded-xl px-6 py-3 mb-4">
              <span className="text-lg font-mono text-[var(--sos-teal)]">
                @Carla-Rawlins
              </span>
            </div>
            <p className="text-xs text-[var(--foreground-muted)]">
              Questions? Email us at{" "}
              <a href="mailto:gray_c@milfordschools.org" className="text-[var(--sos-teal)] hover:underline">
                gray_c@milfordschools.org
              </a>
            </p>
          </div>
        </motion.div>

        {/* Group Registration Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-12 text-center"
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
