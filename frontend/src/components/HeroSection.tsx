import bgImage from "@/assets/bgImage.jpg";

export function HeroSection() {
  return (
    <div className="relative mx-auto -mt-10">
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
        className="h-[700px] w-full rounded-4xl object-cover brightness-80"
      />
    </div>
  );
}
