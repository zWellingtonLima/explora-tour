import type { LucideIcon } from "lucide-react";
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

const data = [
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
    title: "Divirta-se e <span className='text-primary'>Explore",
    description:
      "Veja o que há para fazer, conheça os principais pontos turísticos e descubra opções locais para que tenha uma experiência única e inesquecível.",
    icon: GlobeIcon,
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

export function InfoCardArea() {
  return (
    <>
      {data.map((item) => (
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
