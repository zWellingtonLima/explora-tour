import { Request, Response } from "express";

import database from "infra/database.ts";
import { UserType } from "models/createUserSchema.ts";

const getUsersController = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user: UserType = (
      await database.query({
        text: `SELECT username, user_type FROM users WHERE id=${id};`,
      })
    ).rows[0];

    return res.status(200).json({ data: user });
  } catch (err) {
    console.error("Get users Controller error: ", err);
    return res.status(404).json({ error: "User not found" });
  }
};

export default getUsersController;
