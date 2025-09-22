import express, { Request, Response } from "express";

const statusRouter = express.Router();

statusRouter.get("/", (req: Request, res: Response) => {
  return res.status(200).json({});
});

export = statusRouter;
