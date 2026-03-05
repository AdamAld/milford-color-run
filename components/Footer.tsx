"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Instagram, Facebook, Heart } from "lucide-react";

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook, href: "#", label: "Facebook" },
];

const quickLinks = [
  { label: "About", href: "#about" },
  { label: "Event Details", href: "#details" },
  { label: "Route Map", href: "#route" },
  { label: "Register", href: "#register" },
  // { label: "Sponsors", href: "#sponsors" },
  { label: "FAQ", href: "#faq" },
];

export function Footer() {
  const scrollToSection = (href: string) => {
    if (href === "#") return;
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="relative py-16 px-6 bg-[var(--background-secondary)]">
      {/* Top border gradient */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--sos-teal)] to-transparent opacity-30" />

      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand Column */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold gradient-text mb-4">
                MHS Color Run
              </h3>
              <p className="text-[var(--foreground-muted)] mb-6 leading-relaxed">
                A student-led initiative by Milford High School&apos;s Sources
                of Strength, spreading hope and celebrating community
                through color.
              </p>
              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full glass flex items-center justify-center text-[var(--foreground-muted)] hover:text-[var(--sos-teal)] hover:border-[var(--sos-teal)] transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <social.icon size={18} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-[var(--foreground-muted)] hover:text-[var(--sos-teal)] transition-colors text-sm"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Contact Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:gray_c@milfordschools.org"
                    className="flex items-center gap-3 text-[var(--foreground-muted)] hover:text-[var(--sos-teal)] transition-colors text-sm"
                  >
                    <Mail size={16} />
                    gray_c@milfordschools.org
                  </a>
                </li>
                <li>
                  <div className="flex items-start gap-3 text-[var(--foreground-muted)] text-sm">
                    <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                    <div>
                      <p>Miami Meadows Park</p>
                      <p>1546 State Route 131</p>
                      <p>Milford, OH 45150</p>
                    </div>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="pt-8 border-t border-white/10"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
              <span>&copy; 2026 Milford High School Sources of Strength.</span>
              <span className="hidden md:inline">All rights reserved.</span>
            </div>

            <div className="flex items-center gap-1 text-sm text-[var(--foreground-muted)]">
              <span>Made with</span>
              <Heart
                size={14}
                className="text-[var(--color-pink)] fill-[var(--color-pink)]"
              />
              <span>by MHS Students</span>
            </div>
          </div>

          {/* Sources of Strength Attribution */}
          <div className="mt-6 text-center">
            <p className="text-xs text-[var(--foreground-muted)]">
              <a
                href="https://sourcesofstrength.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--sos-teal)] transition-colors"
              >
                Sources of Strength
              </a>{" "}
              is a best-practice youth suicide prevention program that builds
              socially connected, hope-filled communities.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
