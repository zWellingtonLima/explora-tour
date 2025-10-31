import img from "@/assets/us.jpg";
import bus from "@/assets/bus.jpg";

import { ClientCardArea, DriverCardArea } from "./InfoCardArea";
import { Button } from "./ui/button";

export function WhyUs() {
  return (
    <section className="mx-auto pt-28 pb-20 text-center">
      <h2 className="text-3xl">Como a ExploraTour funciona </h2>
      <p className="text-gray-700">
        Não espere pelo amanhã, busque sua próxima aventura com a ExploraTour.
      </p>

      <div
        className="my-12 flex items-center justify-center gap-8 text-left"
        aria-label="Seção de cadastro para exploradores"
      >
        <div>
          <img
            src={img}
            alt="Prédio de pedra iluminado pelo sol de verão"
            aria-description="Foto de Uiliam Nörnberg : https://www.pexels.com/pt-br/foto/predios-edificios-verao-pedra-22711559/"
            className="h-[700px] rounded-4xl object-cover shadow-md"
          />
        </div>

        <article className="flex min-w-md flex-col gap-4">
          <h3 className="mb-8 text-2xl text-gray-800">
            Apenas alguns cliques te separam de sua viagem
          </h3>

          <ClientCardArea />
          <Button size={"lg"} className="self-end font-bold">
            Buscar viagens
          </Button>
        </article>
      </div>

      <div
        className="my-12 flex items-center justify-center gap-8 text-left"
        aria-label="Seção de cadastro para motoristas ou agentes de viagens"
      >
        <div>
          <img
            src={bus}
            alt="Ônibus de viagem em movimento"
            aria-description="Foto de Egor Litvinov em Unsplash"
            className="h-[650px] rounded-4xl object-cover shadow-md"
          />
        </div>

        <article className="flex min-w-md flex-col gap-4">
          <h3 className="mb-8 text-2xl text-gray-800">
            Transforme suas rotas em oportunidades reais
          </h3>

          <DriverCardArea />
          <Button size={"lg"} className="self-end font-bold">
            Cadastrar suas rotas
          </Button>
        </article>
      </div>
    </section>
  );
}
