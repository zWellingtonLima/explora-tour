import getStatusController from "controllers/status.controller.ts";
import express from "express";

const statusRouter = express.Router();

statusRouter.get("/", getStatusController);

export default statusRouter;
