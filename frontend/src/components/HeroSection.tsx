import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import bgImage from "@/assets/bgImage.jpg";

export function HeroSection() {
  return (
    <section className="relative mx-auto -mt-10">
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <h1 className="text-center text-5xl font-extrabold text-white drop-shadow-md">
          Encontre sua próxima{" "}
          <span className="underline underline-offset-4">aventura</span>
        </h1>
      </div>
      <img
        src={bgImage}
        alt="Foto arquitetura medieval"
        aria-description="Foto de Letícia Fracalossi: https://www.pexels.com/pt-br/foto/ponto-de-referencia-ponto-historico-arquitetura-medieval-18811639/"
        className="h-[750px] w-full rounded-4xl object-cover brightness-80"
      />

      <div className="relative -mt-14 flex w-full justify-center gap-4">
        <Card className="gap-0 text-center">
          <CardHeader>
            <CardTitle className="f-heading text-2xl">
              <span>+ 10 mil</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">
            <span>Clientes totais</span>
          </CardContent>
        </Card>

        <Card className="gap-0 text-center">
          <CardHeader>
            <CardTitle className="f-heading text-2xl">+ 5</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">
            <span>Anos de experiência</span>
          </CardContent>
        </Card>

        <Card className="gap-0 text-center">
          <CardHeader>
            <CardTitle className="f-heading text-2xl">
              <span>+ 2 mil</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">
            <span>Viagens realizadas</span>
          </CardContent>
        </Card>

        <Card className="gap-0 text-center">
          <CardHeader>
            <CardTitle className="f-heading text-2xl">4.9</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">Avaliações médias</CardContent>
        </Card>
      </div>
    </section>
  );
}
