"use client";

import {
  BackgroundElements,
  HeroSection,
  FeaturesSection,
  PhoneShowcase,
  FAQSection,
  Footer,
} from "@/components/landing";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background with proper colors and gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
      </div>

      <BackgroundElements />

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center p-6">
        <HeroSection />
      </section>

      {/* Features Section */}
      <section className="relative flex items-center justify-center">
        <FeaturesSection />
      </section>

      {/* Phone Showcase Section */}
      <section className="relative flex items-center justify-center">
        <PhoneShowcase />
      </section>

      {/* FAQ Section */}
      <section className="relative flex items-center justify-center">
        <FAQSection />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
