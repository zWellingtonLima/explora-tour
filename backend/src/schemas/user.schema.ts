import { z } from "zod";

export const UserCoreSchema = z.object({
  id: z.ulid().optional(),
  email: z.email(),
  username: z.string(),
  user_type: z.enum(["driver", "traveler"]),
});

export const DriverDataSchema = z.object({
  driver_licence: z
    .object({
      number: z.string(),
      category: z.string(),
      expiration: z.string(),
    })
    .optional(),
  vehicle: z
    .object({
      brand: z.string(),
      model: z.string(),
      year: z.number(),
      licence_plate: z.string(),
    })
    .optional(),
});

//TODO: add properties, pastTravels
export const TravelerDataSchema = z.object({});
