import { AccessTokenPayload } from "infra/http/jwt.service.ts";

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}
