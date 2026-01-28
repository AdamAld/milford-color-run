import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
const PRIVATE_KEY = (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");

// Event date used for age calculation
const EVENT_DATE = new Date("2026-03-22");

function getAge(dob: string): number {
  const birth = new Date(dob);
  let age = EVENT_DATE.getFullYear() - birth.getFullYear();
  const m = EVENT_DATE.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && EVENT_DATE.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function sanitize(value: unknown, maxLen = 500): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

function formatPhoneDigits(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length !== 10) return digits;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Sanitize inputs
    const firstName = sanitize(body.firstName, 100);
    const lastName = sanitize(body.lastName, 100);
    const email = sanitize(body.email, 200);
    const dateOfBirth = sanitize(body.dateOfBirth, 10);
    const phone = sanitize(body.phone, 20);
    const tshirtSize = sanitize(body.tshirtSize, 10);
    const entryFeePayment = sanitize(body.entryFeePayment, 100);
    const emergencyContactName = sanitize(body.emergencyContactName, 100);
    const emergencyContactPhone = sanitize(body.emergencyContactPhone, 20);
    const parentGuardianName = sanitize(body.parentGuardianName, 100);
    const parentGuardianPhone = sanitize(body.parentGuardianPhone, 20);
    const electronicSignature = sanitize(body.electronicSignature, 200);
    const waiverAgreed = body.waiverAgreed === true;

    // Validate required fields
    const required: Record<string, string> = {
      firstName,
      lastName,
      email,
      dateOfBirth,
      emergencyContactName,
      emergencyContactPhone,
      electronicSignature,
      tshirtSize,
    };
    const missing = Object.entries(required)
      .filter(([, v]) => !v)
      .map(([k]) => k);

    if (missing.length > 0 || !waiverAgreed) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${[...missing, ...(!waiverAgreed ? ["waiverAgreed"] : [])].join(", ")}` },
        { status: 400 }
      );
    }

    // Email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Payment method validation
    if (entryFeePayment !== "VENMO" && entryFeePayment !== "CASH") {
      return NextResponse.json(
        { success: false, error: "Invalid payment method" },
        { status: 400 }
      );
    }

    // Phone validation: required phones must be 10 digits, optional phone validated if present
    const ecPhoneDigits = emergencyContactPhone.replace(/\D/g, "");
    if (ecPhoneDigits.length !== 10) {
      return NextResponse.json(
        { success: false, error: "Emergency contact phone must be 10 digits" },
        { status: 400 }
      );
    }
    const phoneDigits = phone.replace(/\D/g, "");
    if (phone && phoneDigits.length !== 10) {
      return NextResponse.json(
        { success: false, error: "Phone number must be 10 digits" },
        { status: 400 }
      );
    }

    // Age-based validation
    const age = getAge(dateOfBirth);
    if (age < 18) {
      if (!parentGuardianName || !parentGuardianPhone) {
        return NextResponse.json(
          { success: false, error: "Parent/guardian name and phone are required for participants under 18" },
          { status: 400 }
        );
      }
      const pgPhoneDigits = parentGuardianPhone.replace(/\D/g, "");
      if (pgPhoneDigits.length !== 10) {
        return NextResponse.json(
          { success: false, error: "Parent/guardian phone must be 10 digits" },
          { status: 400 }
        );
      }
    }

    // Authenticate with Google Sheets API
    const auth = new google.auth.JWT({
      email: SERVICE_ACCOUNT_EMAIL,
      key: PRIVATE_KEY,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const timestamp = new Date().toISOString();

    // Append-only: we only ever call spreadsheets.values.append
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A:N",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            timestamp,
            firstName,
            lastName,
            email,
            dateOfBirth,
            phone ? formatPhoneDigits(phone) : "",
            tshirtSize,
            entryFeePayment,
            emergencyContactName,
            formatPhoneDigits(emergencyContactPhone),
            parentGuardianName,
            parentGuardianPhone ? formatPhoneDigits(parentGuardianPhone) : "",
            electronicSignature,
            waiverAgreed ? "Yes" : "No",
          ],
        ],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Registration API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit registration" },
      { status: 500 }
    );
  }
}
