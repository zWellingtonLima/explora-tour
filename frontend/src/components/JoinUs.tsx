import { Button } from "@/components/ui/button";

export function JoinUs() {
  return (
    <>
      <article className="mx-auto my-20 max-w-4xl px-2">
        <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-4xl bg-primary text-center text-white">
          <div
            aria-disabled
            className="bg-pattern absolute z-0 h-full w-full bg-cover opacity-5"
          />
          <div className="z-10 my-10 px-2">
            <h3 className="text-xl font-bold">
              Explorar novos lugares nunca foi tão simples.
            </h3>
            <p>Junte-se a nós e aventure-se.</p>
            <Button variant={"outline"} size="lg" className="mt-4 text-primary">
              Buscar aventura
            </Button>
          </div>
        </div>
      </article>
    </>
  );
}
