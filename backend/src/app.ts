import express, { Request, Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ chave: "Valor" });
});

export = app;
