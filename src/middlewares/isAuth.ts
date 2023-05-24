import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: "Not authorized" });

  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError")
        return res.status(401).json({ error: "Token has expired" });
      return res.status(401).json({ error: "Invalid token" });
    }
    return next();
  });
};
