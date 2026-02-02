import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm, useStore } from "@tanstack/react-form";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { SubmitButton } from "./SubmitButton";

import signUpBg from "@/assets/signUp.jpg";
import { loginUserSchema, type loginUserType } from "@/schemas/loginUserSchema";

const api_login_endpoint = `${import.meta.env.VITE_BASE_API_URL}/auth/login`;

export function LoginForm() {
  const [open, setOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: loginUserType) => {
      const response = await fetch(api_login_endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const payload = await response.json().catch(() => null);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (!response.ok)
        throw payload.error ?? new Error("Registration failed!");

      return payload;
    },
    onSuccess: ({ data }) => {
      setOpen(false);
      form.reset();

      // TODO: create a hook to verify current user logged in.
      console.log(data.accessToken);

      toast.success("Login com sucesso!", {
        position: "top-center",
      });
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginUserSchema,
      onSubmitAsync: async ({ value }) => {
        try {
          await mutation.mutateAsync(value);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          return {
            fields: {
              password: [err.details],
            },
          };
        }
      },
    },
    onSubmitInvalid() {
      const InvalidInput = document.querySelector(
        '[aria-invalid="true"]',
      ) as HTMLInputElement;

      InvalidInput?.focus();
    },
  });

  const isFormValid = useStore(form.store, (s) => s.isValid);
  const isSubmitting = mutation.isPending;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Entrar</Button>
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
              <DialogTitle className="text-center">Entrar</DialogTitle>
              <DialogDescription>
                Bem vindo de volta. Digite seus dados de acesso que a{" "}
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
                    name="email"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;

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
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            placeholder="Digite seu email..."
                            className="py-6"
                          />
                        </Field>
                      );
                    }}
                  />

                  <form.Field
                    name="password"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;

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
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            placeholder="Digite a sua senha..."
                            className="py-6"
                          />
                          {isInvalid && (
                            <em
                              role="alert"
                              className="text-sm font-normal text-destructive"
                            >
                              {field.state.meta.errors[0]?.message ||
                                field.state.meta.errors.join(", ")}
                            </em>
                          )}
                        </Field>
                      );
                    }}
                  />

                  <SubmitButton
                    loading={isSubmitting}
                    disabled={!isFormValid || isSubmitting}
                    label="Entrar"
                    loadingLabel="Verificando..."
                  />
                </FieldGroup>
              </form>
            </div>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
}
