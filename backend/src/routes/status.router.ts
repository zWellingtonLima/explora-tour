import getStatusController from "controllers/status.controller";
import express from "express";

const statusRouter = express.Router();

statusRouter.get("/", getStatusController);

export = statusRouter;
