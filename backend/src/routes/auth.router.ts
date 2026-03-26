import express from "express";

import {
  register,
  login,
  refresh,
  logout,
} from "controllers/auth.controller.ts";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/refresh", refresh);
authRouter.get("/logout", logout);

export default authRouter;
