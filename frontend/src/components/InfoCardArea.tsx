import type { LucideIcon } from "lucide-react";
import {
  BarChart3Icon,
  BusIcon,
  CalendarClockIcon,
  GlobeIcon,
  MapPinCheckIcon,
  RouteIcon,
  UserPlusIcon,
  WalletIcon,
} from "lucide-react";

import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const clientData = [
  {
    id: 1,
    title: "Busque sua exploração",
    description:
      "Pesquise diferentes cidades e descubra qual destino combina mais com o tipo de viagem que você procura — seja descanso, aventura ou cultura.",
    icon: MapPinCheckIcon,
  },
  {
    id: 2,
    title: "Reserve sua passagem",
    description:
      "Compare preços e horários entre companhias, e reserve suas passagens com antecedência para garantir o melhor  custo-benefício.",
    icon: CalendarClockIcon,
  },
  {
    id: 3,
    title: "Faça o pagamento",
    description:
      "Escolha a forma de pagamento que preferir e finalize sua compra com segurança, sem taxas escondidas ou complicações.",
    icon: WalletIcon,
  },
  {
    id: 4,
    title: "Divirta-se e Explore",
    description:
      "Veja o que há para fazer, conheça os principais pontos turísticos e descubra opções locais para que tenha uma experiência única e inesquecível.",
    icon: GlobeIcon,
  },
];

const driverData = [
  {
    id: 1,
    title: "Crie sua conta",
    description:
      "Cadastre-se como motorista ou agente de viagens para começar a oferecer suas rotas e serviços diretamente na plataforma.",
    icon: UserPlusIcon,
  },
  {
    id: 2,
    title: "Cadastre seu veículo",
    description:
      "Adicione informações sobre o seu veículo, como modelo, capacidade e conforto, para que os viajantes saibam exatamente o que esperar.",
    icon: BusIcon,
  },
  {
    id: 3,
    title: "Crie sua rota",
    description:
      "Defina seus trajetos, pontos de partida e destino, horários e valores. Deixe suas rotas visíveis para os viajantes interessados.",
    icon: RouteIcon,
  },
  {
    id: 4,
    title: "Gerencie suas viagens",
    description:
      "Acompanhe reservas, atualize horários, ajuste preços e mantenha o controle total das suas rotas e clientes em um só lugar.",
    icon: BarChart3Icon,
  },
];

interface InfoCard {
  title: string;
  description: string;
  icon: LucideIcon;
}

function InfoCard({ title, description, icon: Icon }: InfoCard) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardAction>
          <Icon />
        </CardAction>
        <CardDescription className="text-gray-800">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export function ClientCardArea() {
  return (
    <>
      {clientData.map((item) => (
        <InfoCard
          key={item.id}
          title={item.title}
          description={item.description}
          icon={item.icon}
        />
      ))}
    </>
  );
}

export function DriverCardArea() {
  return (
    <>
      {driverData.map((item) => (
        <InfoCard
          key={item.id}
          title={item.title}
          description={item.description}
          icon={item.icon}
        />
      ))}
    </>
  );
}
