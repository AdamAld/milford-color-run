"use client";

import { useState, FormEvent, useEffect, useRef, useCallback } from "react";
import { Send, Loader2, CheckCircle, AlertCircle, User, Mail, Phone, Shirt, Heart, Calendar, PenLine } from "lucide-react";
import { track } from "@/lib/analytics";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  phone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  tshirtSize: string;
  parentGuardianName: string;
  parentGuardianPhone: string;
  entryFeePayment: string;
  electronicSignature: string;
  waiverAgreed: boolean;
}

const EVENT_DATE = new Date("2026-05-02");

function getAge(dob: string): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  let age = EVENT_DATE.getFullYear() - birth.getFullYear();
  const m = EVENT_DATE.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && EVENT_DATE.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function getTodayFormatted(): string {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const yyyy = now.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

interface FormErrors {
  [key: string]: string;
}

// T-shirt sizes must match exactly what Google Form expects
const TSHIRT_SIZES = ["YS", "YM", "YL", "XS", "S", "M", "L", "XL", "XXL"];

// Display labels for t-shirt sizes
// Display labels for t-shirt sizes
const TSHIRT_SIZE_LABELS: Record<string, string> = {
  "YS": "Youth Small",
  "YM": "Youth Medium",
  "YL": "Youth Large",
  "XS": "Adult XS",
  "S": "Adult Small",
  "M": "Adult Medium",
  "L": "Adult Large",
  "XL": "Adult XL",
  "XXL": "Adult XXL",
};

export function RegistrationForm() {
  const formRef = useRef<HTMLDivElement>(null);
  const hasTrackedStart = useRef(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    phone: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    tshirtSize: "",
    parentGuardianName: "",
    parentGuardianPhone: "",
    entryFeePayment: "VENMO",
    electronicSignature: "",
    waiverAgreed: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  // Scroll to success message when form is submitted
  useEffect(() => {
    if (submitStatus === "success" && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [submitStatus]);

  const age = getAge(formData.dateOfBirth);
  const isMinor = age !== null && age < 18;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }

    if (formData.phone.trim() && formData.phone.replace(/\D/g, "").length !== 10) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.tshirtSize) {
      newErrors.tshirtSize = "Please select a t-shirt size";
    }

    if (!formData.emergencyContactName.trim()) {
      newErrors.emergencyContactName = "Emergency contact name is required";
    }

    if (!formData.emergencyContactPhone.trim()) {
      newErrors.emergencyContactPhone = "Emergency contact phone is required";
    } else if (formData.emergencyContactPhone.replace(/\D/g, "").length !== 10) {
      newErrors.emergencyContactPhone = "Please enter a valid 10-digit phone number";
    }

    if (isMinor) {
      if (!formData.parentGuardianName.trim()) {
        newErrors.parentGuardianName = "Parent/guardian name is required for participants under 18";
      }
      if (!formData.parentGuardianPhone.trim()) {
        newErrors.parentGuardianPhone = "Parent/guardian phone is required for participants under 18";
      } else if (formData.parentGuardianPhone.replace(/\D/g, "").length !== 10) {
        newErrors.parentGuardianPhone = "Please enter a valid 10-digit phone number";
      }
    }

    if (!formData.electronicSignature.trim()) {
      newErrors.electronicSignature = "Electronic signature is required";
    } else if (expectedSignature && formData.electronicSignature.trim() !== expectedSignature) {
      newErrors.electronicSignature = `Please type exactly: ${expectedSignature}`;
    }

    if (!formData.waiverAgreed) {
      newErrors.waiverAgreed = "You must agree to the waiver";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Submit via API route which proxies to Google Forms
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          dateOfBirth: formData.dateOfBirth,
          phone: formData.phone || "",
          emergencyContactName: formData.emergencyContactName,
          emergencyContactPhone: formData.emergencyContactPhone,
          tshirtSize: formData.tshirtSize,
          parentGuardianName: formData.parentGuardianName || "",
          parentGuardianPhone: formData.parentGuardianPhone || "",
          entryFeePayment: formData.entryFeePayment,
          electronicSignature: formData.electronicSignature,
          waiverAgreed: formData.waiverAgreed,
        }),
      });

      const result = await response.json();

      if (result.success) {
        track("registration_form_submitted", {
          payment_method: formData.entryFeePayment,
          is_minor: isMinor,
        });
        setSubmitStatus("success");

        // Reset form after successful submission
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          dateOfBirth: "",
          phone: "",
          emergencyContactName: "",
          emergencyContactPhone: "",
          tshirtSize: "",
          parentGuardianName: "",
          parentGuardianPhone: "",
          entryFeePayment: "VENMO",
          electronicSignature: "",
          waiverAgreed: false,
        });
      } else {
        console.error("Registration failed:", result.error);
        track("registration_form_error", { error: result.error });
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Registration error:", error);
      track("registration_form_error", { error: String(error) });
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const trackFormStarted = useCallback(() => {
    if (!hasTrackedStart.current) {
      hasTrackedStart.current = true;
      track("registration_form_started");
    }
  }, []);

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    trackFormStarted();
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handlePhoneChange = (field: keyof FormData, raw: string) => {
    handleInputChange(field, formatPhone(raw));
  };

  const expectedSignature = formData.firstName.trim() && formData.lastName.trim()
    ? `${formData.firstName.trim().toUpperCase()} ${formData.lastName.trim().toUpperCase()} - ${getTodayFormatted()}`
    : "";

  if (submitStatus === "success") {
    return (
      <div ref={formRef} className="glass rounded-2xl p-8 md:p-10 text-center">
        <div className="w-20 h-20 rounded-full bg-green-500/20 mx-auto mb-6 flex items-center justify-center">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">Registration Submitted!</h3>

        <p className="text-[var(--foreground-muted)] mb-6 max-w-md mx-auto">
          Thank you for registering! Please complete your payment via Venmo to{" "}
          <span className="text-[var(--sos-teal)] font-mono">@Carla-Rawlins</span>.
          Include <span className="text-white font-semibold">SOS Color Run</span> and your name in the payment note.
        </p>
        <div className="glass rounded-xl px-6 py-4 mb-6 inline-block">
          <p className="text-sm text-[var(--foreground-muted)]">Payment Amount</p>
          <p className="text-2xl font-bold text-[var(--sos-teal)]">$25</p>
        </div>
        <p className="text-sm text-[var(--foreground-muted)] mb-6">
          You&apos;ll receive a confirmation email once your payment is verified.
        </p>

        <p className="text-sm text-[var(--foreground-muted)] mb-6">
          Questions? Contact us at{" "}
          <a href="mailto:gray_c@milfordschools.org" className="text-[var(--sos-teal)] hover:underline">
            gray_c@milfordschools.org
          </a>
        </p>

        <button
          onClick={() => setSubmitStatus("idle")}
          className="gradient-button px-8 py-3 rounded-xl font-semibold text-white transition-transform hover:scale-105"
        >
          Register Another Person
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 md:p-10">
      <h3 className="text-2xl font-bold text-white mb-2 text-center">Registration Form</h3>
      <p className="text-[var(--foreground-muted)] text-center mb-8">
        Fill out the form below to secure your spot
      </p>

      {submitStatus === "error" && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3">
          <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
          <p className="text-red-400 text-sm">
            There was an error submitting your registration. Please try again.
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            <User size={16} className="inline mr-2 text-[var(--sos-teal)]" />
            First Name *
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
              errors.firstName ? "border-red-500" : "border-white/10"
            } text-white placeholder-white/40 focus:outline-none focus:border-[var(--sos-teal)] transition-colors`}
            placeholder="First name"
          />
          {errors.firstName && (
            <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            <User size={16} className="inline mr-2 text-[var(--sos-teal)]" />
            Last Name *
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
              errors.lastName ? "border-red-500" : "border-white/10"
            } text-white placeholder-white/40 focus:outline-none focus:border-[var(--sos-teal)] transition-colors`}
            placeholder="Last name"
          />
          {errors.lastName && (
            <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            <Mail size={16} className="inline mr-2 text-[var(--sos-teal)]" />
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
              errors.email ? "border-red-500" : "border-white/10"
            } text-white placeholder-white/40 focus:outline-none focus:border-[var(--sos-teal)] transition-colors`}
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            <Calendar size={16} className="inline mr-2 text-[var(--sos-teal)]" />
            Date of Birth *
          </label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
              errors.dateOfBirth ? "border-red-500" : "border-white/10"
            } text-white placeholder-white/40 focus:outline-none focus:border-[var(--sos-teal)] transition-colors`}
          />
          {errors.dateOfBirth && (
            <p className="text-red-400 text-sm mt-1">{errors.dateOfBirth}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            <Phone size={16} className="inline mr-2 text-[var(--sos-teal)]" />
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handlePhoneChange("phone", e.target.value)}
            className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
              errors.phone ? "border-red-500" : "border-white/10"
            } text-white placeholder-white/40 focus:outline-none focus:border-[var(--sos-teal)] transition-colors`}
            placeholder="(555) 123-4567"
          />
          {errors.phone && (
            <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* T-Shirt Size */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            <Shirt size={16} className="inline mr-2 text-[var(--sos-teal)]" />
            T-Shirt Size *
          </label>
          <select
            value={formData.tshirtSize}
            onChange={(e) => handleInputChange("tshirtSize", e.target.value)}
            className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
              errors.tshirtSize ? "border-red-500" : "border-white/10"
            } text-white focus:outline-none focus:border-[var(--sos-teal)] transition-colors appearance-none cursor-pointer`}
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem center", backgroundSize: "1.5rem" }}
          >
            <option value="" className="bg-[var(--background)]">Select size</option>
            {TSHIRT_SIZES.map((size) => (
              <option key={size} value={size} className="bg-[var(--background)]">
                {TSHIRT_SIZE_LABELS[size] || size}
              </option>
            ))}
          </select>
          {errors.tshirtSize && (
            <p className="text-red-400 text-sm mt-1">{errors.tshirtSize}</p>
          )}
        </div>

        {/* Payment Info */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white mb-2">
            Payment Method
          </label>
          <div className="p-4 rounded-xl border-2 border-[var(--sos-teal)] bg-[var(--sos-teal)]/10">
            <div className="text-lg font-bold text-white flex items-center gap-2">
              Venmo
            </div>
            <div className="text-sm text-[var(--foreground-muted)] mt-1">
              After registering, send payment via Venmo. Include <span className="text-white font-semibold">SOS Color Run</span> and your name in the note.
            </div>
            <div className="text-xs text-[var(--sos-teal)] mt-2 font-mono">
              @Carla-Rawlins
            </div>
          </div>
        </div>

        {/* Emergency Contact Section */}
        <div className="md:col-span-2">
          <div className="border-t border-white/10 pt-6 mt-2">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Heart size={18} className="text-red-400" />
              Emergency Contact Information
            </h4>
          </div>
        </div>

        {/* Emergency Contact Name */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Emergency Contact Name *
          </label>
          <input
            type="text"
            value={formData.emergencyContactName}
            onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
            className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
              errors.emergencyContactName ? "border-red-500" : "border-white/10"
            } text-white placeholder-white/40 focus:outline-none focus:border-[var(--sos-teal)] transition-colors`}
            placeholder="Contact name"
          />
          {errors.emergencyContactName && (
            <p className="text-red-400 text-sm mt-1">{errors.emergencyContactName}</p>
          )}
        </div>

        {/* Emergency Contact Phone */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Emergency Contact Phone *
          </label>
          <input
            type="tel"
            value={formData.emergencyContactPhone}
            onChange={(e) => handlePhoneChange("emergencyContactPhone", e.target.value)}
            className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
              errors.emergencyContactPhone ? "border-red-500" : "border-white/10"
            } text-white placeholder-white/40 focus:outline-none focus:border-[var(--sos-teal)] transition-colors`}
            placeholder="(555) 123-4567"
          />
          {errors.emergencyContactPhone && (
            <p className="text-red-400 text-sm mt-1">{errors.emergencyContactPhone}</p>
          )}
        </div>

        {/* Parent/Guardian Fields (shown for minors) */}
        {isMinor && (
          <>
            <div className="md:col-span-2">
              <div className="border-t border-white/10 pt-6 mt-2">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  Parent/Guardian Information (required for participants under 18)
                </h4>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Parent/Guardian Name *
              </label>
              <input
                type="text"
                value={formData.parentGuardianName}
                onChange={(e) => handleInputChange("parentGuardianName", e.target.value)}
                className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                  errors.parentGuardianName ? "border-red-500" : "border-white/10"
                } text-white placeholder-white/40 focus:outline-none focus:border-[var(--sos-teal)] transition-colors`}
                placeholder="Parent/Guardian full name"
              />
              {errors.parentGuardianName && (
                <p className="text-red-400 text-sm mt-1">{errors.parentGuardianName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Parent/Guardian Phone *
              </label>
              <input
                type="tel"
                value={formData.parentGuardianPhone}
                onChange={(e) => handlePhoneChange("parentGuardianPhone", e.target.value)}
                className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                  errors.parentGuardianPhone ? "border-red-500" : "border-white/10"
                } text-white placeholder-white/40 focus:outline-none focus:border-[var(--sos-teal)] transition-colors`}
                placeholder="(555) 123-4567"
              />
              {errors.parentGuardianPhone && (
                <p className="text-red-400 text-sm mt-1">{errors.parentGuardianPhone}</p>
              )}
            </div>
          </>
        )}

        {/* Waiver Agreement */}
        <div className="md:col-span-2">
          <div className="border-t border-white/10 pt-6 mt-2">
            <label className={`flex items-start gap-3 cursor-pointer p-4 rounded-xl border ${
              errors.waiverAgreed ? "border-red-500 bg-red-500/5" : "border-white/10"
            }`}>
              <input
                type="checkbox"
                checked={formData.waiverAgreed}
                onChange={(e) => handleInputChange("waiverAgreed", e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-white/30 bg-white/5 text-[var(--sos-teal)] focus:ring-[var(--sos-teal)] focus:ring-offset-0"
              />
              <span className="text-sm text-[var(--foreground-muted)]">
                I agree to the event waiver and terms. I understand that participation in this event involves physical activity and I assume all risks associated with participation. I release Milford High School Sources of Strength and all affiliated parties from any liability. *
              </span>
            </label>
            {errors.waiverAgreed && (
              <p className="text-red-400 text-sm mt-1">{errors.waiverAgreed}</p>
            )}
          </div>
        </div>

        {/* Electronic Signature */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white mb-2">
            <PenLine size={16} className="inline mr-2 text-[var(--sos-teal)]" />
            Electronic Signature and Date *
          </label>
          <p className="text-xs text-[var(--foreground-muted)] mb-2">
            {expectedSignature ? (
              <>Type exactly: <span className="text-white font-mono">{expectedSignature}</span></>
            ) : (
              <>Enter your first and last name above, then type your full name in ALL CAPS followed by today&apos;s date.</>
            )}
          </p>
          <input
            type="text"
            value={formData.electronicSignature}
            onChange={(e) => handleInputChange("electronicSignature", e.target.value.toUpperCase())}
            className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
              errors.electronicSignature ? "border-red-500" : "border-white/10"
            } text-white placeholder-white/40 focus:outline-none focus:border-[var(--sos-teal)] transition-colors uppercase`}
            placeholder={expectedSignature || "FIRSTNAME LASTNAME - MM/DD/YYYY"}
          />
          {errors.electronicSignature && (
            <p className="text-red-400 text-sm mt-1">{errors.electronicSignature}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full gradient-button py-4 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={20} className="animate-spin" />
              Submitting...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Send size={20} />
              Submit Registration
            </span>
          )}
        </button>
      </div>

      <p className="text-center text-xs text-[var(--foreground-muted)] mt-4">
        After submitting, you&apos;ll receive instructions to complete payment via Venmo.
      </p>
    </form>
  );
}
