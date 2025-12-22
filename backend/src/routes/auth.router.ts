import express, { Request, Response } from "express";

import registerUser from "controllers/auth.controller.ts";

const authRouter = express.Router();

authRouter.post("/register", registerUser);

authRouter.get("/login", (req: Request, res: Response) => {
  return res;
});

export default authRouter;
