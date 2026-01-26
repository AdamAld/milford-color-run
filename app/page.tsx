import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { EventDetails } from "@/components/EventDetails";
import { Registration } from "@/components/Registration";
import { Sponsors } from "@/components/Sponsors";
import { Volunteer } from "@/components/Volunteer";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { ParticleBackground, RouteMap } from "@/components/LazyComponents";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Floating particles - lazy loaded */}
      <ParticleBackground />

      {/* Navigation */}
      <Navbar />

      {/* Page Sections */}
      <Hero />
      <About />
      <EventDetails />
      <RouteMap />
      <Registration />
      <Sponsors />
      <Volunteer />
      <FAQ />
      <Footer />
    </main>
  );
}
