import { Link } from "@tanstack/react-router";

export function Logo() {
  return (
    <Link
      to="/"
      className="logo flex gap-1"
      aria-label="Link para carregar a página principal"
    >
      <img
        className="w-4 md:w-5"
        src="logo.svg"
        alt="Logo de aventureiro caminhando"
      />
      <span className="text-xl md:text-2xl text-blue-500">ExploraTour</span>
    </Link>
  );
}
