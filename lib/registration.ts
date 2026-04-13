import { track } from "@/lib/analytics";

export const REGISTRATION_URL = "https://www.locallevelevents.com/events/details/44011";

export function trackRegistrationClick(location: string) {
  track("registration_external_click", {
    destination: REGISTRATION_URL,
    location,
  });
}
