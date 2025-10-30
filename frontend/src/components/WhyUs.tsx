import img from "@/assets/us.jpg";
import { InfoCardArea } from "./InfoCardArea";

export function WhyUs() {
  return (
    <section className="mx-auto py-28 text-center">
      <h2 className="text-3xl">Como a ExploraTour funciona </h2>
      <p className="text-gray-700">
        Não espere pelo amanhã, busque sua próxima aventura com a ExploraTour.
      </p>

      <div className="my-12 flex items-center justify-center gap-8 text-left">
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

          <InfoCardArea />
        </article>
      </div>
    </section>
  );
}
