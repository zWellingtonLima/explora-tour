import { Router } from "express";
import { authController } from "modules/auth/auth.controller.ts";
import { authValidator } from "modules/auth/auth.validator.ts";
import { authenticateToken } from "infra/http/middlewares/auth.middleware.ts";

const authRouter = Router();

authRouter.post("/register", authValidator.register, authController.register);
authRouter.post("/login", authValidator.login, authController.login);
authRouter.post("/refresh", authController.refresh);
authRouter.post("/logout", authenticateToken, authController.logout);

export default authRouter;
