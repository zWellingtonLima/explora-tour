import express, { Request, Response } from "express";

import register from "controllers/auth.controller.ts";

const authRouter = express.Router();

authRouter.post("/register", register);

authRouter.get("/login", (req: Request, res: Response) => {
  return res;
});

export default authRouter;
