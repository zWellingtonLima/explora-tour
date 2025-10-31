import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

export function FAQ() {
  return (
    <section className="mx-auto" aria-label="Área de perguntas frequentes">
      <h2 className="text-center text-3xl">Perguntas Frequentes</h2>
      <Accordion
        type="single"
        collapsible
        defaultValue="item-1"
        className="mx-auto my-4 max-w-4xl"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>1. O que é a plataforma?</AccordionTrigger>
          <AccordionContent>
            É um espaço que conecta viajantes a motoristas e agentes de viagem.
            Aqui você pode encontrar rotas, reservar passagens e também oferecer
            viagens de forma simples e segura.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            2. Como faço para reservar uma viagem?
          </AccordionTrigger>
          <AccordionContent>
            Basta buscar o destino desejado, escolher uma das rotas disponíveis
            e clicar em “Reservar”. Em seguida, você seleciona o método de
            pagamento e recebe a confirmação imediata no seu perfil.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            3. Quais formas de pagamento são aceitas?
          </AccordionTrigger>
          <AccordionContent>
            Aceitamos cartão de crédito, débito , PayPal, Pix, MBWay e outras
            opções mais. Todos os pagamentos são processados com segurança e
            criptografia.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>4. Posso cancelar uma viagem?</AccordionTrigger>
          <AccordionContent>
            Sim. Você pode cancelar diretamente pelo painel da sua conta. As
            regras de reembolso variam de acordo com o prazo antes da partida, e
            estão sempre visíveis antes da confirmação do cancelamento.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>
            5. Como faço para me cadastrar como motorista ou agente?
          </AccordionTrigger>
          <AccordionContent>
            Na página inicial, clique em “Sou motorista/agente” e siga o
            processo de cadastro. Você precisará informar dados pessoais,
            documentos e informações do veículo antes de começar a criar rotas.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-6">
          <AccordionTrigger>
            6. A plataforma cobra alguma taxa dos motoristas?
          </AccordionTrigger>
          <AccordionContent>
            Sim. É cobrada uma pequena comissão sobre cada reserva concluída,
            que ajuda a manter o funcionamento e suporte da plataforma. O valor
            é informado de forma transparente antes da confirmação.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-7">
          <AccordionTrigger>
            7. Como crio minhas rotas e horários?
          </AccordionTrigger>
          <AccordionContent>
            Após o cadastro, acesse “Minhas rotas” e clique em “Nova rota”.
            Defina origem, destino, horários, valores e assentos disponíveis.
            Suas rotas ficam visíveis para os viajantes imediatamente após a
            publicação.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-8">
          <AccordionTrigger>
            8. Como recebo o pagamento das minhas viagens?
          </AccordionTrigger>
          <AccordionContent>
            Os pagamentos são liberados automaticamente após a conclusão da
            viagem, direto para a conta bancária cadastrada. É possível
            acompanhar tudo no painel de “Receitas”.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-9">
          <AccordionTrigger>9. É seguro usar a plataforma?</AccordionTrigger>
          <AccordionContent>
            Sim. Todas as transações são protegidas por camadas de segurança e
            verificação de identidade. Além disso, motoristas e viajantes passam
            por validação de dados para garantir confiança nas viagens.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-10">
          <AccordionTrigger>
            10. Como entro em contato com o suporte?
          </AccordionTrigger>
          <AccordionContent>
            Você pode acessar o chat de suporte pelo site ou app, disponível em
            horário comercial. Também é possível enviar um e-mail para
            suporte@contato.com em qualquer horário.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
