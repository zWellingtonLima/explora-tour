import express, { Request, Response } from "express";

import register from "controllers/auth.controller.ts";

const authRouter = express.Router();

authRouter.post("/register", register);

authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // verify correct input
    // check if user exists
    // check if the password is the same the hashedPassword
    // give them jwt token
  } catch (err) {}
});

export default authRouter;
