import { NextRequest, NextResponse } from "next/server";

// Google Forms URL - use the /e/ format for public form submissions
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfI8qwePgrultQSuoFpbJ8bPMB1Qp1IQaAu0mcb0lEWqhjFCw/formResponse";

const ENTRY_IDS = {
  firstName: "entry.826355120",
  lastName: "entry.107270862",
  email: "entry.1149713456",
  dateOfBirth: "entry.245385898",
  phone: "entry.1212825914",
  emergencyContactName: "entry.1290620365",
  emergencyContactPhone: "entry.476526749",
  waiverAgreed: "entry.2027581858",
  entryFeePayment: "entry.1654569682",
  tshirtSize: "entry.1395051602",
  parentGuardianInfo: "entry.607093130",
  electronicSignature: "entry.598148220",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Registration request received:", JSON.stringify(body, null, 2));

    // Build URL-encoded form data
    const formData = new URLSearchParams();
    formData.append(ENTRY_IDS.firstName, body.firstName || "");
    formData.append(ENTRY_IDS.lastName, body.lastName || "");
    formData.append(ENTRY_IDS.email, body.email || "");
    formData.append(ENTRY_IDS.dateOfBirth, body.dateOfBirth || "");
    formData.append(ENTRY_IDS.phone, body.phone || "");
    formData.append(ENTRY_IDS.emergencyContactName, body.emergencyContactName || "");
    formData.append(ENTRY_IDS.emergencyContactPhone, body.emergencyContactPhone || "");
    formData.append(ENTRY_IDS.tshirtSize, body.tshirtSize || "");
    formData.append(ENTRY_IDS.parentGuardianInfo, body.parentGuardianInfo || "N/A");
    formData.append(ENTRY_IDS.entryFeePayment, body.entryFeePayment || "");
    formData.append(ENTRY_IDS.electronicSignature, body.electronicSignature || "");
    // Waiver expects "Yes" not "I agree"
    formData.append(ENTRY_IDS.waiverAgreed, body.waiverAgreed ? "Yes" : "");

    console.log("Submitting to Google Forms:", formData.toString());

    const response = await fetch(GOOGLE_FORM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    console.log("Google Forms response status:", response.status);

    // Get the response body to check for success confirmation
    const responseText = await response.text();

    // Google Forms may return 400 status but still process the submission successfully
    // We need to check the response body for the confirmation message
    const isSuccess =
      response.ok ||
      response.status === 302 ||
      responseText.includes("We have received your registration") ||
      responseText.includes("Your response has been recorded") ||
      responseText.includes("freebirdFormviewerViewResponseConfirmationMessage");

    if (isSuccess) {
      console.log("Google Forms submission successful");
      return NextResponse.json({ success: true });
    }

    // Log the error for debugging
    console.error("Google Forms error:", response.status);
    console.error("Error response:", responseText.substring(0, 1000));

    return NextResponse.json(
      { success: false, error: "Form submission failed. Please try again." },
      { status: 500 }
    );
  } catch (error) {
    console.error("Registration API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit registration" },
      { status: 500 }
    );
  }
}
