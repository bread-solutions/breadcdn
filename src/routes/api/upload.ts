import { Router, Request, Response } from "express";

export const uploadRoute = Router();

uploadRoute.post("/", (req: Request, res: Response) => {
  console.log(req.body);
  res.send({
    status: "ok",
  });
});