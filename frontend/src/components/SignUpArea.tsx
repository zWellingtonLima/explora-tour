import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";

import {
  signUpSchema,
  type signUpSchemaType,
} from "@/schemas/signUpAreaSchema";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "./ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "./ui/field";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

import signUpBg from "@/assets/signUp.jpg";
import { envConfig } from "@/envConfig";

const api_register_endpoint = envConfig.BASE_API_URL;
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

export function SignUpArea() {
  function registerUser(data: signUpSchemaType) {
    return fetch(api_register_endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  const mutation = useMutation({
    mutationFn: registerUser,
  });

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
      email: "",
      user_type: "traveler",
    },
    validators: {
      onSubmit: signUpSchema,
    },
    onSubmit: async ({ value }) => {
      const parse = signUpSchema.parse(value);
      mutation.mutate(parse);
    },
  });

  return (
    <div className="flex gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Cadastrar-se</Button>
        </DialogTrigger>
        <DialogContent className="items-center border-4 p-0">
          <section className="columns-2">
            <div>
              <img
                src={signUpBg}
                alt="Grupo de aventureiros admirando paisagem"
                className="max-h-[650px] w-[500px] rounded-l-lg object-cover"
              />
            </div>

            <div className="flex h-[650px] flex-col justify-center p-6">
              <DialogHeader className="mb-4">
                <DialogTitle className="text-center">Cadastrar-se</DialogTitle>
                <DialogDescription>
                  Seja você um aventureiro ou motorista, a{" "}
                  <span className="font-bold text-primary">Exploratour</span> te
                  aguarda.
                </DialogDescription>
              </DialogHeader>

              <div>
                <form
                  id="login-form-area"
                  onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                  }}
                >
                  <FieldGroup className="flex-col">
                    <form.Field
                      name="user_type"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;

                        return (
                          <Field>
                            <FieldLabel className="text-gray-700">
                              O que você quer ser?
                            </FieldLabel>
                            <RadioGroup
                              name={field.name}
                              value={field.state.value}
                              onValueChange={field.handleChange}
                              className="flex"
                            >
                              {userTypes.map((user) => (
                                <FieldLabel
                                  key={user.id}
                                  id={user.id}
                                  htmlFor={`login-form-area-${user.id}`}
                                >
                                  <Field
                                    orientation="horizontal"
                                    data-invalid={isInvalid}
                                  >
                                    <FieldTitle>{user.text}</FieldTitle>
                                    <RadioGroupItem
                                      value={user.id}
                                      id={`login-form-area-${user.id}`}
                                      aria-invalid={isInvalid}
                                    />
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

                    <form.Field
                      name="username"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;

                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel
                              className="text-gray-700"
                              htmlFor="login-form-area-username"
                            >
                              Nome de usuário
                            </FieldLabel>
                            <Input
                              id="login-form-area-username"
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
                              placeholder="Digite seu nome de usuário..."
                              autoComplete="username"
                              className="py-6"
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        );
                      }}
                    />

                    <form.Field
                      name="email"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;

                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel
                              className="text-gray-700"
                              htmlFor="login-form-area-email"
                            >
                              Email
                            </FieldLabel>
                            <Input
                              id="login-form-area-email"
                              name={field.name}
                              type="email"
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
                              placeholder="Digite seu email..."
                              className="py-6"
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        );
                      }}
                    />

                    <form.Field
                      name="password"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;

                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel
                              className="text-gray-700"
                              htmlFor="login-form-area-password"
                            >
                              Senha
                            </FieldLabel>
                            <Input
                              id="login-form-area-password"
                              type="password"
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
                              placeholder="Digite a sua senha..."
                              className="py-6"
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        );
                      }}
                    />

                    <Button className="w-full py-6">Explorar</Button>
                  </FieldGroup>
                </form>
              </div>
            </div>
          </section>
        </DialogContent>
      </Dialog>
      <Button variant="outline">Entrar</Button>
    </div>
  );
}
