import { z } from "zod";
import { startOfDay, endOfDay, addYears, isAfter, isEqual } from "date-fns";

const todayStart = () => startOfDay(new Date());

export const searchTripSchema = z.object({
  destination: z
    .string()
    .min(2, "O destino deve conter pelo menos duas letras.")
    .max(15, "O destino digitado está muito grande.")
    .regex(
      /^[a-zA-Z]+$/,
      "O nome do destino não pode conter números ou caracteres especiais.",
    ),

  dateSelected: z
    .date({ error: "Selecione uma data válida." })
    .refine(
      (d) => {
        const dStart = startOfDay(d);
        const today = todayStart();
        return isEqual(dStart, today) || isAfter(dStart, today);
      },
      { message: "A data deve ser igual ou superior ao dia de hoje." },
    )
    .refine(
      (d) => {
        const max = endOfDay(addYears(new Date(), 1));
        return d <= max;
      },
      { message: "Selecione uma data dentro de 1 ano." },
    ),
});
