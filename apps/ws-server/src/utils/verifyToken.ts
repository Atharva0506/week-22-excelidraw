import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export const verifyJWT = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded !== "object" || !decoded || !("id" in decoded)) {
      return null;
    }

    return (decoded as { id: string }).id;
  } catch (err:any) {
    console.error("Token verification failed:", err.message);
    return null;
  }
};
