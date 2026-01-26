"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const EVENT_DATE = new Date("2026-05-02T10:00:00");

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <motion.div
          key={value}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="glass rounded-xl p-4 md:p-6 min-w-[70px] md:min-w-[100px]"
        >
          <span className="text-3xl md:text-5xl font-bold gradient-text">
            {value.toString().padStart(2, "0")}
          </span>
        </motion.div>
        {/* Decorative glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[var(--sos-teal)] to-[var(--sos-purple)] rounded-xl opacity-20 blur-xl -z-10" />
      </div>
      <span className="text-xs md:text-sm text-[var(--foreground-muted)] mt-2 uppercase tracking-wider">
        {label}
      </span>
    </motion.div>
  );
}

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = EVENT_DATE.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="flex gap-3 md:gap-6 justify-center">
        {["Days", "Hours", "Minutes", "Seconds"].map((label) => (
          <div key={label} className="flex flex-col items-center">
            <div className="glass rounded-xl p-4 md:p-6 min-w-[70px] md:min-w-[100px]">
              <span className="text-3xl md:text-5xl font-bold gradient-text">00</span>
            </div>
            <span className="text-xs md:text-sm text-[var(--foreground-muted)] mt-2 uppercase tracking-wider">
              {label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-3 md:gap-6 justify-center">
      <TimeBlock value={timeLeft.days} label="Days" />
      <TimeBlock value={timeLeft.hours} label="Hours" />
      <TimeBlock value={timeLeft.minutes} label="Minutes" />
      <TimeBlock value={timeLeft.seconds} label="Seconds" />
    </div>
  );
}
