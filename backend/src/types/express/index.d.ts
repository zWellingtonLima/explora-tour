import { AccessTokenPayload } from "services/jwt.service.ts";

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}
