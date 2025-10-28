import { Header } from "@/components/Header";
import { SearchForm } from "@/components/SearchForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <Header />
      <main>
        <SearchForm />
      </main>
    </div>
  );
}
