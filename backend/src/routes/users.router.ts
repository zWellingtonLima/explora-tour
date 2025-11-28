import express from "express";

import postUsersController from "controllers/users.controller.ts";

const usersRouter = express.Router();

usersRouter.post("/", postUsersController);
// usersRouter.post("/", (req, res) => {});
// usersRouter.put("/", (req, res) => {});

export default usersRouter;
