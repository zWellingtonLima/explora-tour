import express from "express";

import getStatusController from "controllers/status.controller.ts";

const statusRouter = express.Router();

statusRouter.get("/", getStatusController);

export default statusRouter;
