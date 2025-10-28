export function Header() {
  return (
    <header className="flex items-center justify-between gap-2 border-b-2 border-blue-100 py-4">
      <div>
        <a
          href="/"
          className="logo flex gap-1"
          aria-label="Link para carregar a página principal"
        >
          <img
            className="w-6"
            src="logo.svg"
            alt="Logo de aventureiro caminhando"
          />
          <span className="text-blue-500">ExploraTour</span>
        </a>
      </div>
      <nav>
        <ul className="flex gap-4 text-gray-600">
          <li>
            <a href="/adventurer">Aventureiro</a>
          </li>
          <li>
            <a href="/adventurer">Condutor</a>
          </li>
          <li>
            <a href="/adventurer">Sobre nós</a>
          </li>
        </ul>
      </nav>
      <div>Login Area</div>
    </header>
  );
}
