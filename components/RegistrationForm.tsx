"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import { Send, Loader2, CheckCircle, AlertCircle, User, Mail, Phone, Shirt, Heart, Calendar, PenLine } from "lucide-react";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  phone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  tshirtSize: string;
  parentGuardianInfo: string;
  entryFeePayment: string;
  electronicSignature: string;
  waiverAgreed: boolean;
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
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    phone: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    tshirtSize: "",
    parentGuardianInfo: "",
    entryFeePayment: "Yes, I paid",
    electronicSignature: "",
    waiverAgreed: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submittedPaymentMethod, setSubmittedPaymentMethod] = useState<string>("");

  // Scroll to success message when form is submitted
  useEffect(() => {
    if (submitStatus === "success" && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [submitStatus]);

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

    if (!formData.tshirtSize) {
      newErrors.tshirtSize = "Please select a t-shirt size";
    }

    if (!formData.emergencyContactName.trim()) {
      newErrors.emergencyContactName = "Emergency contact name is required";
    }

    if (!formData.emergencyContactPhone.trim()) {
      newErrors.emergencyContactPhone = "Emergency contact phone is required";
    }

    if (!formData.electronicSignature.trim()) {
      newErrors.electronicSignature = "Electronic signature is required";
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
          parentGuardianInfo: formData.parentGuardianInfo || "N/A",
          entryFeePayment: formData.entryFeePayment,
          electronicSignature: formData.electronicSignature,
          waiverAgreed: formData.waiverAgreed,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Save payment method before resetting form
        setSubmittedPaymentMethod(formData.entryFeePayment);
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
          parentGuardianInfo: "",
          entryFeePayment: "Yes, I paid",
          electronicSignature: "",
          waiverAgreed: false,
        });
      } else {
        console.error("Registration failed:", result.error);
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
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

  if (submitStatus === "success") {
    const isVenmoPayment = submittedPaymentMethod === "Yes, I paid";

    return (
      <div ref={formRef} className="glass rounded-2xl p-8 md:p-10 text-center">
        <div className="w-20 h-20 rounded-full bg-green-500/20 mx-auto mb-6 flex items-center justify-center">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">Registration Submitted!</h3>

        {isVenmoPayment ? (
          <>
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
          </>
        ) : (
          <>
            <p className="text-[var(--foreground-muted)] mb-4 max-w-md mx-auto">
              Thank you for registering! You&apos;ve selected to pay with <span className="text-white font-semibold">cash at the event</span>.
            </p>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-6 py-4 mb-6 max-w-md mx-auto">
              <p className="text-amber-400 font-semibold mb-1">Reminder: No T-Shirt Included</p>
              <p className="text-sm text-amber-300/80">
                Cash payments do not include an event t-shirt. To receive a t-shirt, please pay via Venmo before the event.
              </p>
            </div>
            <div className="glass rounded-xl px-6 py-4 mb-6 inline-block">
              <p className="text-sm text-[var(--foreground-muted)]">Cash Payment at Event</p>
              <p className="text-2xl font-bold text-white">$25</p>
            </div>
          </>
        )}

        <p className="text-sm text-[var(--foreground-muted)] mb-6">
          Questions? Contact us at{" "}
          <a href="mailto:c_gray@milfordschools.org" className="text-[var(--sos-teal)] hover:underline">
            c_gray@milfordschools.org
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
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[var(--sos-teal)] transition-colors"
            placeholder="(555) 123-4567"
          />
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

        {/* Payment Method */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white mb-2">
            Payment Method *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleInputChange("entryFeePayment", "Yes, I paid")}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                formData.entryFeePayment === "Yes, I paid"
                  ? "border-[var(--sos-teal)] bg-[var(--sos-teal)]/10"
                  : "border-white/10 hover:border-white/30"
              }`}
            >
              <div className="text-lg font-bold text-white flex items-center gap-2">
                💳 Venmo
              </div>
              <div className="text-sm text-[var(--foreground-muted)] mt-1">
                Pay via Venmo to receive your t-shirt
              </div>
              <div className="text-xs text-[var(--sos-teal)] mt-2 font-mono">
                @Carla-Rawlins
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleInputChange("entryFeePayment", "No, I will pay cash and not recieve a shirt")}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                formData.entryFeePayment === "No, I will pay cash and not recieve a shirt"
                  ? "border-amber-500 bg-amber-500/10"
                  : "border-white/10 hover:border-white/30"
              }`}
            >
              <div className="text-lg font-bold text-white flex items-center gap-2">
                💵 Cash at Event
              </div>
              <div className="text-sm text-[var(--foreground-muted)] mt-1">
                Pay cash on event day
              </div>
              <div className="text-xs text-amber-400 mt-2 font-semibold">
                ⚠️ No t-shirt included with cash payment
              </div>
            </button>
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
            onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)}
            className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
              errors.emergencyContactPhone ? "border-red-500" : "border-white/10"
            } text-white placeholder-white/40 focus:outline-none focus:border-[var(--sos-teal)] transition-colors`}
            placeholder="(555) 123-4567"
          />
          {errors.emergencyContactPhone && (
            <p className="text-red-400 text-sm mt-1">{errors.emergencyContactPhone}</p>
          )}
        </div>

        {/* Parent/Guardian Info (for minors) */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white mb-2">
            Parent/Guardian Name and Phone (if participant is under 18)
          </label>
          <input
            type="text"
            value={formData.parentGuardianInfo}
            onChange={(e) => handleInputChange("parentGuardianInfo", e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[var(--sos-teal)] transition-colors"
            placeholder="Parent/Guardian name and phone number"
          />
        </div>

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
            Type your full name in ALL CAPS followed by today&apos;s date. Example: <span className="text-white font-mono">JOHN DOE - 01/25/2026</span>
          </p>
          <input
            type="text"
            value={formData.electronicSignature}
            onChange={(e) => handleInputChange("electronicSignature", e.target.value.toUpperCase())}
            className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
              errors.electronicSignature ? "border-red-500" : "border-white/10"
            } text-white placeholder-white/40 focus:outline-none focus:border-[var(--sos-teal)] transition-colors uppercase`}
            placeholder="FIRSTNAME LASTNAME - MM/DD/YYYY"
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
