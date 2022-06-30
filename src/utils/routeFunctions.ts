import { NextFunction, Request, Response } from "express";
import { getUser } from "../db";

export async function canUpload(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const uploadToken = req.query["token"] as string;
  if (!uploadToken) return res.status(401).send("No token provided");
  const user = await getUser({ authToken: uploadToken }).catch(() => null);
  if (!user) return res.status(401).send("Invalid token");
  next();
}

export async function isSameUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.query["token"] as string;
  if (!token) {
    return res.status(401).send("No token provided");
  }
  const userFromToken = await getUser({ authToken: token }).catch(() => null);
  if (!userFromToken) return res.status(401).send("Invalid token");
  next();
}
