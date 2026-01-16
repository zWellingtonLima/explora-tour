import { Facebook, Instagram, Linkedin } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t-2 border-blue-100 pt-4 pb-6">
      <section className="flex flex-col items-center gap-10 py-2 md:flex-row md:justify-around">
        <article className="grid grid-cols-3 gap-12 pt-2 md:gap-20 [&>*]:grid">
          <div className="[&>*:first-child]:mb-2">
            <h3>Empresa</h3>
            <a href="">Sobre nós</a>
            <a href="">Carreiras</a>
            <a href="">Blog</a>
          </div>
          <div className="[&>*:first-child]:mb-2">
            <h3>Suporte</h3>
            <a href="">Sobre nós</a>
            <a href="">Carreiras</a>
            <a href="">Blog</a>
          </div>
          <div className="[&>*:first-child]:mb-2">
            <h3>Legal</h3>
            <a href="">Sobre nós</a>
            <a href="">Carreiras</a>
            <a href="">Blog</a>
          </div>
        </article>
        <div className="grid place-items-center md:place-items-start">
          <Logo />
          <div className="my-4">
            <p className="mb-2">Conectando exploradores aos seus destinos</p>

            <div className="flex justify-center gap-4 text-gray-600 md:justify-start">
              <Instagram />
              <Facebook />
              <Linkedin />
            </div>
          </div>
        </div>
      </section>
      <p className="border-t pt-4 text-center text-sm text-gray-600">
        © 2026 ExploraTour. Todos os direitos reservados
      </p>
    </footer>
  );
}
