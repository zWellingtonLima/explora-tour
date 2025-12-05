import express from "express";

import {
  postUsersController,
  getUsersController,
} from "controllers/users.controller.ts";

const usersRouter = express.Router();

usersRouter.post("/", postUsersController);
usersRouter.put("/:id", (req, res) => {});
// usersRouter.detele("/:id", (req, res) => {});

// Just for testing purposes 
usersRouter.get("/", getUsersController);

export default usersRouter;
