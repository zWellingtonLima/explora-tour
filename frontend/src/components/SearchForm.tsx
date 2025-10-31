import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, ShieldAlertIcon } from "lucide-react";
import { format } from "date-fns";

import { Field, FieldError, FieldGroup } from "./ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Calendar } from "./ui/calendar";
import { Item, ItemContent, ItemDescription } from "./ui/item";

const formSchema = z.object({
  destination: z
    .string()
    .min(2, "O destino deve conter pelo menos duas letras.")
    .max(15, "O destino digitado está muito grande.")
    .regex(/^[a-zA-Z]+$/, "O nome do destino não pode conter números."),
  dateSelected: z.date({ message: "Selecione uma data." }),
});

type FormSchema = z.infer<typeof formSchema>;

export function SearchForm() {
  const {
    watch,
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitted },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      dateSelected: new Date(),
    },
  });

  const formIsInvalid = isSubmitted && !isValid;
  const errorMessage = errors.destination?.message;

  const formatDateString = watch("dateSelected")
    ? format(watch("dateSelected"), "dd-MM-yyyy")
    : "Selecionar data";

  const handleSearchSubmit = (data: FormSchema) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleSearchSubmit)}
      className="relative z-20 mt-10 w-full"
    >
      <FieldGroup className="rounded-4xl border-1 bg-white px-8 py-6 shadow-md">
        <Controller
          name="destination"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Insira o destino"
                autoComplete="off"
                value={field.value}
                onChange={field.onChange}
                className="border-0 border-b border-primary"
              />
            </Field>
          )}
        />

        <Popover>
          <PopoverTrigger asChild aria-label="Selecione a data da viagem">
            <Button
              variant={"outline"}
              className="min-w-44 border-0 border-b border-primary"
            >
              <CalendarIcon className="size-4" />
              {formatDateString}
            </Button>
          </PopoverTrigger>

          <PopoverContent>
            <Controller
              name="dateSelected"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Calendar
                    id={field.name}
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    {...field}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </PopoverContent>
        </Popover>

        <Button size={"lg"} className="font-bold">
          Explorar
        </Button>
      </FieldGroup>
      {formIsInvalid && (
        <Item className="mx-auto max-w-4xl px-8" aria-label={errorMessage}>
          <ItemContent className="flex-row">
            <ShieldAlertIcon className="text-gray-400" />
            <ItemDescription>{errorMessage}</ItemDescription>
          </ItemContent>
        </Item>
      )}
    </form>
  );
}
