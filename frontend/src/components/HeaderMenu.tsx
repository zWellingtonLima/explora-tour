export function HeaderMenu() {
  return (
    <nav className="mt-2 ml-8 hidden md:block">
      <ul className="flex gap-4 text-gray-600">
        <li>
          <a href="/adventurer">Aventureiro</a>
        </li>
        <li>
          <a href="/driver">Condutor</a>
        </li>
        <li>
          <a href="/about">Sobre nós</a>
        </li>
      </ul>
    </nav>
  );
}
