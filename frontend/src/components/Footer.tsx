import { Facebook, Instagram, Linkedin } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t-2 border-blue-100 pt-4 pb-6">
      <section className="flex justify-between py-2">
        <article className="flex gap-20 pt-2">
          <div className="flex flex-col">
            <h3>Empresa</h3>
            <a href="">Sobre nós</a>
            <a href="">Carreiras</a>
            <a href="">Blog</a>
          </div>
          <div className="flex flex-col">
            <h3>Suporte</h3>
            <a href="">Sobre nós</a>
            <a href="">Carreiras</a>
            <a href="">Blog</a>
          </div>
          <div className="flex flex-col">
            <h3>Legal</h3>
            <a href="">Sobre nós</a>
            <a href="">Carreiras</a>
            <a href="">Blog</a>
          </div>
        </article>
        <div>
          <Logo />
          <div className="my-4">
            <p className="mb-2">Conectando exploradores aos seus destinos</p>

            <div className="flex gap-4 text-gray-600">
              <Instagram />
              <Facebook />
              <Linkedin />
            </div>
          </div>
        </div>
      </section>
      <p className="border-t pt-4 text-sm text-gray-600">
        © 2025 ExploraTour. Todos os direitos reservados
      </p>
    </footer>
  );
}
