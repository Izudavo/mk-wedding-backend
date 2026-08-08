import jwt from "jsonwebtoken";

import { env } from "../../config/env";

type AdminJwtPayload = {
  id: string;
  username: string;
};

export function signAdminToken(payload: AdminJwtPayload) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET);
}