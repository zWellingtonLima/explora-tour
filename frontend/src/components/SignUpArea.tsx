import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignUpForm";

export function SignUpArea() {
  return (
    <div className="flex gap-4">
      <SignUpForm />
      <LoginForm />
    </div>
  );
}
