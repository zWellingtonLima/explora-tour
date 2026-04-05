import { CorsOptions } from "cors";
import { envConfig } from "config/env.ts";

const whitelist = envConfig.ALLOWED_ORIGINS.split(",").map((o) => o.trim());

const corsOptions: CorsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    // permite requisições sem Origin (Postman, server-to-server, testes)
    if (!origin) return callback(null, true);

    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    }
  },
};

export default corsOptions;
