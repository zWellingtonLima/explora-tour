import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "infra/http/middlewares/errorHandler.ts";
import router from "infra/http/router.ts";
import corsOptions from "config/cors.ts";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/v1", router);

app.use(errorHandler);

export default app;
