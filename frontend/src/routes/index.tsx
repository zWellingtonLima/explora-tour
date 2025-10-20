import { Header } from "@/components/Header";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <Header />
      <div>Conteúdo da Home</div>
    </div>
  );
}
