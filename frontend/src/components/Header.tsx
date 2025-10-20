export function Header() {
  return (
    <header className="flex justify-between items-center gap-2 py-4 text-blue-500">
      <div>
        <a href="/" className="flex logo gap-1">
          <img
            className="w-6"
            src="logo.svg"
            alt="Logo de aventureiro caminhando"
          />
          <span className="">ExploraTour</span>
        </a>
      </div>
      <nav>
        <ul className="flex gap-4">
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
