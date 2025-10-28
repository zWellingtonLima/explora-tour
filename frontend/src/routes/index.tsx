import { Header } from "@/components/Header";
import { SearchForm } from "@/components/SearchForm";
import { createFileRoute } from "@tanstack/react-router";

import bgImage from "@/assets/bgImage.jpg";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4">
      <Header />
      <main>
        <SearchForm />

        <div className="mx-auto -mt-10 max-w-6xl">
          <img
            src={bgImage}
            alt="Foto arquitetura medieval"
            aria-description="Foto de Letícia Fracalossi: https://www.pexels.com/pt-br/foto/ponto-de-referencia-ponto-historico-arquitetura-medieval-18811639/"
            className="rounded-4xl"
          />
        </div>
      </main>
    </div>
  );
}
