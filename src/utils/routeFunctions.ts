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

export async function checkPhoto(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("running");
  if (req.url.match(new RegExp("^.+\\."))) {
    return res
      .status(200)
      .sendFile(req.url.substring(1), { root: "./storage" });
  } else next();
}
