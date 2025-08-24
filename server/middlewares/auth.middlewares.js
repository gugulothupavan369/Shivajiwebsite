import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function requireAuth(req, res, next) {
  const token = req.cookies?.jwt;
  if (!token) return res.status(401).json({ error: "No token, unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });
    req.user = decoded;
    next();
  });
}
