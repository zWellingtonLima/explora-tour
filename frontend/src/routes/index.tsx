import { createFileRoute } from "@tanstack/react-router";

import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { SearchForm } from "@/components/SearchForm";
import { WhyUs } from "@/components/WhyUs";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4">
      <Header />
      <main>
        <SearchForm />
        <HeroSection />
        <WhyUs />
      </main>
    </div>
  );
}
