"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What should I wear?",
    answer:
      "We recommend wearing white or light-colored clothing so the colors really pop! Wear clothes you don't mind getting colorful. Athletic wear and running shoes are ideal. Don't forget sunglasses to protect your eyes!",
  },
  {
    question: "Is this a timed race?",
    answer:
      "No, this is not a timed competitive race. It's a fun run/walk where the goal is to have fun, celebrate community, and get colorful! You can run, jog, walk, or skip—whatever makes you happy.",
  },
  {
    question: "Is the color powder safe?",
    answer:
      "Yes! The color powder is made from food-grade cornstarch and FDA-approved dyes. It's non-toxic, biodegradable, and washes out of clothes and off skin easily with water. However, if you have respiratory sensitivities, we recommend wearing a bandana over your nose and mouth.",
  },
  {
    question: "Can kids participate?",
    answer:
      "Absolutely! This is a family-friendly event. Children of all ages are welcome. Kids 10 and under can register at a discounted rate, and children in strollers are free! We just ask that children under 12 be accompanied by an adult.",
  },
  {
    question: "What if it rains?",
    answer:
      "The Color Run is a rain or shine event! A little water actually makes the colors more vibrant. In case of severe weather (lightning, etc.), we will post updates on our social media and send email notifications about any changes.",
  },
  {
    question: "Is there parking available?",
    answer:
      "Yes, Miami Meadows Park has plenty of free parking. We recommend arriving early (by 9:00 AM) to secure a spot close to the start/finish area.",
  },
  {
    question: "Can I walk instead of run?",
    answer:
      "Of course! Many participants walk the entire course. There's no pressure to run—the event is about having fun and supporting mental health awareness. Go at your own pace!",
  },
  {
    question: "What's included in my registration?",
    answer:
      "Your registration includes an event t-shirt, color powder packets, access to the post-race celebration, and a commemorative bib number. Water and light refreshments will be available at the finish line.",
  },
  {
    question: "Can I get a refund if I can't attend?",
    answer:
      "Registrations are non-refundable, but you can transfer your registration to another person. Please email us at gray_c@milfordschools.org to arrange a transfer.",
  },
  {
    question: "How do I pick up my race packet?",
    answer:
      "Race packet pickup details will be sent via email to all registered participants. Options will include pickup at Milford High School the day before the event, or on-site the morning of the race starting at 8:30 AM.",
  },
];

function FAQItem({
  faq,
  isOpen,
  onClick,
  index,
}: {
  faq: { question: string; answer: string };
  isOpen: boolean;
  onClick: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="glass rounded-xl overflow-hidden"
    >
      <button
        onClick={onClick}
        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
      >
        <span className="font-semibold text-white pr-4">{faq.question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <ChevronDown size={20} className="text-[var(--sos-teal)]" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 text-[var(--foreground-muted)] leading-relaxed border-t border-white/5 pt-4">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6 section-darker"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--sos-purple)] to-transparent opacity-30" />
        <motion.div
          className="absolute bottom-1/4 right-0 w-64 h-64 rounded-full bg-[var(--sos-teal)] opacity-5 blur-[100px]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-4">
            <HelpCircle size={18} className="text-[var(--sos-teal)]" />
            <span className="text-sm text-[var(--foreground-muted)]">
              Got Questions?
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Frequently Asked{" "}
            <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-lg text-[var(--foreground-muted)]">
            Everything you need to know about the Color Run. Can&apos;t find your
            answer? Reach out to us!
          </p>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-3"
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              index={index}
            />
          ))}
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-[var(--foreground-muted)] mb-4">
            Still have questions?
          </p>
          <a
            href="mailto:gray_c@milfordschools.org"
            className="inline-flex items-center gap-2 text-[var(--sos-teal)] hover:underline"
          >
            Contact us at gray_c@milfordschools.org
          </a>
        </motion.div>
      </div>
    </section>
  );
}
