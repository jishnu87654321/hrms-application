"use client";

import { useRouter } from "next/navigation";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { AnalyticsPreview } from "@/components/landing/analytics-preview";
import { Workflow } from "@/components/landing/workflow";
import { Benefits } from "@/components/landing/benefits";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";
import { Background3D } from "@/components/landing/background-3d";

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/login");
  };

  return (
    <main 
      className="min-h-screen bg-background cursor-pointer"
      onClick={handleClick}
    >
      <Background3D />
      <Navbar />
      <Hero />
      <Features />
      <section id="analytics">
        <AnalyticsPreview />
      </section>
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
