import express from "express";

import {
  postUsersController,
  getUsersController,
} from "controllers/users.controller.ts";

const usersRouter = express.Router();

usersRouter.get("/:id", getUsersController);
usersRouter.post("/", postUsersController);

// Allows users to modify they own data.
// usersRouter.put("/:id", (req, res) => {});
// Allows users delete their own accounts.
// usersRouter.delete("/:id", (req, res) => {});

export default usersRouter;
