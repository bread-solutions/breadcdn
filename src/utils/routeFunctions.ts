import { NextFunction, Request, Response } from "express";
import { getUser } from "../db";

export async function canUpload(req: Request, res: Response, next: NextFunction) {
    const uploadToken = req.query["token"] as string;
    if(!uploadToken) return res.status(401).send("No token provided");
    const user = await getUser({authToken: uploadToken}).catch(() => null);
    if(!user) return res.status(401).send("Invalid token");
    next();
}
