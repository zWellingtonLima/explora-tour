import type { TokenPayload } from "services/jwt.service.ts";

export {};

declare global {
  namespace Express {
    export interface Request {
      user?: TokenPayload | string ;
    }
  }
}
