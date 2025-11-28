import express from "express";

import postUsersController from "controllers/users.controller.ts";

const usersRouter = express.Router();

usersRouter.post("/", postUsersController);
usersRouter.put("/:id", (req, res) => {});
// usersRouter.detele("/:id", (req, res) => {});

export default usersRouter;
