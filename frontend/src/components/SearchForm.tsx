import { useForm } from "@tanstack/react-form";
import { searchTripSchema } from "@/schemas/searchTripSchema";

import { CalendarIcon, ShieldAlertIcon } from "lucide-react";
import { format } from "date-fns";

import { Field, FieldGroup } from "./ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Calendar } from "./ui/calendar";
import { Item, ItemContent } from "./ui/item";

export function SearchForm() {
  const form = useForm({
    defaultValues: {
      destination: "",
      dateSelected: new Date(),
    },
    validators: {
      onSubmit: searchTripSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  return (
    <form
      id="home-search-form"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="relative z-20 mx-auto mt-10 w-full max-w-3xl"
    >
      <FieldGroup className="rounded-4xl border-1 bg-white px-8 py-6 shadow-md">
        <form.Field
          name="destination"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  aria-invalid={isInvalid}
                  autoComplete="off"
                  placeholder="Insira o destino"
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="border-0 border-b border-primary"
                />
              </Field>
            );
          }}
        />

        <form.Field
          name="dateSelected"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <Popover>
                  <PopoverTrigger
                    asChild
                    aria-label="Selecione a data da viagem"
                  >
                    <Button
                      variant={"outline"}
                      className="min-w-44 border-0 border-b border-primary"
                    >
                      <CalendarIcon className="size-4" />
                      {format(field.state.value, "dd/MM/yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={field.state.value}
                      onSelect={(date) => date && field.handleChange(date)}
                    />
                  </PopoverContent>
                </Popover>
              </Field>
            );
          }}
        />
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button size={"lg"} type="submit" aria-disabled={!canSubmit}>
              {isSubmitting ? "Buscando..." : "Explorar"}
            </Button>
          )}
        />
      </FieldGroup>
      <form.Subscribe
        selector={(state) => [state.errorMap]}
        children={([errorMap]) =>
          errorMap.onSubmit ? (
            <Item
              className="absolute mt-1 w-full max-w-3xl rounded-3xl bg-white p-2 text-sm text-red-600"
              aria-label="Campos do formulário com erro"
            >
              <ItemContent className="flex-row justify-center">
                <ShieldAlertIcon className="mr-2 self-center text-red-400" />
                <ul>
                  {errorMap.onSubmit?.destination?.map(({ message }) => {
                    return <li key={message}>{message}</li>;
                  })}
                  {errorMap.onSubmit?.dateSelected?.map(({ message }) => {
                    return <li key={message}>{message}</li>;
                  })}
                </ul>
              </ItemContent>
            </Item>
          ) : null
        }
      />
    </form>
  );
}
