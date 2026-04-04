import { Router } from "express";
import { authController } from "controllers/auth.controller.ts";
import { authValidator } from "validators/auth.validator.ts";
import { authenticateToken } from "middlewares/auth.middleware.ts";

const authRouter = Router();

authRouter.post("/register", authValidator.register, authController.register);
authRouter.post("/login", authValidator.login, authController.login);
authRouter.post("/refresh", authController.refresh);
authRouter.post("/logout", authenticateToken, authController.logout);

export default authRouter;
