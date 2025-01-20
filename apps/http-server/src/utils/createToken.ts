import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

if (!JWT_SECRET) {
  console.error("JWT SECRET NOT FOUND!!");
  process.exit(1);
}

export const createJwtToken =  (id: string,username:string) => {
  try {
    return jwt.sign({id,username}, JWT_SECRET, { expiresIn: "5h" });
  } catch (error) {
    console.error("Error while generating JWT Token");
    process.exit(1);
  }
};
