import { z } from "zod";

export const UserResponseSchema = z.object({
  id: z.ulid().optional(),
  user_type: z.enum(["driver", "traveler"]),
  email: z.email(),
  username: z.string(),
  created_at: z.date(),
});

export type UserResponseType = z.infer<typeof UserResponseSchema>;
