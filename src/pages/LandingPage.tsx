import { Navbar } from "../components/landing/navbar";
import { Hero } from "../components/landing/hero";
import { Features } from "../components/landing/features";
import { Workflow } from "../components/landing/workflow";
import { Benefits } from "../components/landing/benefits";
import { CTA } from "../components/landing/cta";
import { Footer } from "../components/landing/footer";
import { Background3D } from "../components/landing/background-3d";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0c0a1d]">
      <Background3D />
      <Navbar />
      <Hero />
      <Features />
      <section id="workflow">
        <Workflow />
      </section>
      <section id="benefits">
        <Benefits />
      </section>
      <CTA />
      <Footer />
    </main>
  );
}
