import img from "@/assets/us.jpg";
import bus from "@/assets/bus.jpg";

import { ClientCardArea, DriverCardArea } from "./InfoCardArea";
import { Button } from "./ui/button";

export function WhyUs() {
  return (
    <section className="mx-auto pt-16 pb-20 text-center sm:pt-28">
      <h2 className="text-2xl md:text-3xl">Como a ExploraTour funciona </h2>
      <p className="text-sm text-gray-700 md:text-base">
        Não espere pelo amanhã, busque já sua próxima aventura com a
        ExploraTour.
      </p>

      <div
        className="my-12 flex flex-col items-center justify-center gap-8 text-left md:flex-row"
        aria-label="Seção de cadastro para exploradores"
      >
        <div>
          <img
            src={img}
            alt="Construção em pedra iluminado pelo sol de verão"
            aria-description="Foto de Uiliam Nörnberg : https://www.pexels.com/pt-br/foto/predios-edificios-verao-pedra-22711559/"
            className="aspect-video h-[300px] rounded-4xl object-cover object-center shadow-md md:aspect-auto md:h-[700px] md:w-auto"
          />
        </div>

        <article className="flex flex-col gap-4">
          <h3 className="my-4 text-xl text-gray-800 md:my-8 md:text-2xl">
            Apenas alguns cliques te separam de sua viagem
          </h3>

          <ClientCardArea />
          <Button size={"lg"} className="self-auto py-6 md:self-end md:py-4">
            Buscar viagens
          </Button>
        </article>
      </div>

      <div
        className="mt-16 flex flex-col items-center justify-center gap-8 text-left md:my-12 md:flex-row"
        aria-label="Seção de cadastro para motoristas ou agentes de viagens"
      >
        <div>
          <img
            src={bus}
            alt="Ônibus de viagem em movimento"
            aria-description="Foto de Egor Litvinov em Unsplash"
            className="aspect-video h-[300px] rounded-4xl object-cover object-center shadow-md md:aspect-auto md:h-[700px] md:w-auto"
          />
        </div>

        <article className="flex flex-col gap-4">
          <h3 className="my-4 text-xl text-gray-800 md:my-8 md:text-2xl">
            Transforme suas rotas em oportunidades reais
          </h3>

          <DriverCardArea />
          <Button size={"lg"} className="self-auto py-6 md:self-end md:py-4">
            Cadastrar suas rotas
          </Button>
        </article>
      </div>
    </section>
  );
}
