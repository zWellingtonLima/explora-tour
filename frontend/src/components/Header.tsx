import { HeaderMenu } from "./HeaderMenu";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import signUp from "@/assets/signup.jpg";
import { FieldGroup, FieldSet } from "./ui/field";

export function Header() {
  return (
    <header className="flex items-center justify-between gap-2 border-b-2 border-blue-100 py-4">
      <div className="flex items-center">
        <Logo />
        <HeaderMenu />
      </div>
      <div className="flex gap-4">
        <Dialog modal>
          <DialogTrigger asChild>
            <Button>Cadastrar-se</Button>
          </DialogTrigger>
          <DialogContent>
            <section className="columns-2 gap-4">
              <div>
                <img
                  src={signUp}
                  alt="Grupo de aventureiros admirando paisagem"
                  className="h-[650px] rounded-lg object-cover object-left"
                />
              </div>
              <DialogHeader>
                <DialogTitle className="text-center">Cadastrar-se</DialogTitle>

                <form>
                  <FieldGroup>
                    <FieldSet></FieldSet>
                  </FieldGroup>
                </form>
              </DialogHeader>
            </section>
          </DialogContent>
        </Dialog>
        <Button variant="outline">Entrar</Button>
      </div>
    </header>
  );
}
