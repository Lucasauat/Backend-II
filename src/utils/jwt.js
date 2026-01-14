import jwt from "jsonwebtoken";

export const PRIVATE_KEY = "jwtSecret";

export const generateToken = user => {
  return jwt.sign(
    { user },
    PRIVATE_KEY,
    { expiresIn: "1h" }
  );
};
