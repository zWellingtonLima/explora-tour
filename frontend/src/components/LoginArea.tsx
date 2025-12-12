import { useForm } from "@tanstack/react-form";
import { loginAreaSchema } from "@/schemas/loginAreaSchema";

import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "./ui/dialog";
import { DialogHeader } from "./ui/dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "./ui/field";
import { Button } from "./ui/button";

import signUp from "@/assets/signup.jpg";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { RadioGroup } from "./ui/radio-group";

export function LoginArea() {
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
      email: "",
      userType: "traveler",
    },
    validators: {
      onSubmit: loginAreaSchema,
    },
  });

  const userTypes = [
    {
      id: "traveler",
      text: "Viajante",
    },
    {
      id: "driver",
      text: "Motorista",
    },
  ] as const;

  return (
    <div className="flex gap-4">
      <Dialog modal open>
        <DialogTrigger asChild>
          <Button>Cadastrar-se</Button>
        </DialogTrigger>
        <DialogContent className="p-0">
          <section className="columns-2 gap-4">
            <div>
              <img
                src={signUp}
                alt="Grupo de aventureiros admirando paisagem"
                className="h-[650px] rounded-l-lg object-cover object-left"
              />
            </div>

            <DialogHeader className="p-4">
              <DialogTitle className="text-center">Cadastrar-se</DialogTitle>

              <form
                id="login-form-area"
                onSubmit={(e) => {
                  e.preventDefault();
                  form.handleSubmit();
                }}
              >
                <FieldGroup>
                  <form.Field
                    name="userType"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;

                      return (
                        <Field>
                          <FieldLegend>Escolha o tipo de usuário</FieldLegend>
                          <RadioGroup
                            name={field.name}
                            value={field.state.value}
                            onValueChange={field.handleChange}
                          >
                            {userTypes.map((user) => (
                              <FieldLabel
                                id={user.id}
                                htmlFor={`login-form-area-${user.id}`}
                              >
                                <Field
                                  orientation="responsive"
                                  className="flex-col  border-2"
                                  data-invalid={isInvalid}
                                >
                                  <FieldTitle>{user.text}</FieldTitle>
                                </Field>
                              </FieldLabel>
                            ))}
                          </RadioGroup>

                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                </FieldGroup>
              </form>
            </DialogHeader>
          </section>
        </DialogContent>
      </Dialog>
      <Button variant="outline">Entrar</Button>
    </div>
  );
}
