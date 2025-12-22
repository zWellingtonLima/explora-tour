import { createFileRoute } from "@tanstack/react-router";

import { HeroSection } from "@/components/HeroSection";
import { SearchForm } from "@/components/SearchForm";
import { WhyUs } from "@/components/WhyUs";
import { FAQ } from "@/components/FAQ";
import { JoinUs } from "@/components/JoinUs";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <main>
      <SearchForm />
      <HeroSection />
      <WhyUs />
      <FAQ />
      <JoinUs />
      <Footer />
    </main>
  );
}
