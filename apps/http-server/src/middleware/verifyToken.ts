import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { NextFunction, Request, Response } from "express";
interface DecodedToken {
  id: string;
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      user: DecodedToken;
    }
  }
}
if (!JWT_SECRET) {
  console.error("JWT SECRET NOT FOUND!!");
  process.exit(1);
}

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1]!;
  if (!token) {
    res.json({ error: "Access Denied: No Token Provided" }).status(401);
    return;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token is not vaild:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
