import {
  CalendarClockIcon,
  GlobeIcon,
  MapPinCheckIcon,
  WalletIcon,
} from "lucide-react";

import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import img from "@/assets/us.jpg";

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
            Poucos cliques para você
          </h3>

          <Card>
            <CardHeader>
              <CardTitle>Busque sua exploração</CardTitle>
              <CardAction>
                <MapPinCheckIcon />
              </CardAction>
              <CardDescription className="text-gray-800">
                Pesquise diferentes cidades e descubra qual destino combina mais
                com o tipo de viagem que você procura — seja descanso, aventura
                ou cultura.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reserve sua passagem</CardTitle>
              <CardAction>
                <CalendarClockIcon />
              </CardAction>
              <CardDescription className="text-gray-800">
                Compare preços e horários entre companhias, e reserve suas
                passagens com antecedência para garantir o melhor
                custo-benefício.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Faça o pagamento</CardTitle>
              <CardAction>
                <WalletIcon />
              </CardAction>
              <CardDescription className="text-gray-800">
                Escolha a forma de pagamento que preferir e finalize sua compra
                com segurança, sem taxas escondidas ou complicações.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Divirta-se e <span className="text-primary">Explore</span>
              </CardTitle>
              <CardAction>
                <GlobeIcon />
              </CardAction>
              <CardDescription className="text-gray-800">
                Veja o que há para fazer, conheça os principais pontos
                turísticos e descubra opções locais para que tenha uma
                experiência única e inesquecível.
              </CardDescription>
            </CardHeader>
          </Card>
        </article>
      </div>
    </section>
  );
}
