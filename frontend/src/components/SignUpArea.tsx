import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignUpForm";

export function SignUpArea() {
  return (
    <div className="hidden gap-2 sm:flex">
      <SignUpForm />
      <LoginForm />
    </div>
  );
}
