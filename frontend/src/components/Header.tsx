import { HeaderMenu } from "./HeaderMenu";
import { Logo } from "./Logo";
import { LoginArea } from "./LoginArea";

export function Header() {
  return (
    <header className="flex items-center justify-between gap-2 border-b-2 border-blue-100 py-4">
      <div className="flex items-center">
        <Logo />
        <HeaderMenu />
      </div>
      <LoginArea />
    </header>
  );
}
