import { Link } from "@tanstack/react-router";

export function Logo() {
  return (
    <Link
      to="/"
      className="logo flex gap-1"
      aria-label="Link para carregar a página principal"
    >
      <img
        className="w-6"
        src="logo.svg"
        alt="Logo de aventureiro caminhando"
      />
      <span className="text-blue-500">ExploraTour</span>
    </Link>
  );
}
