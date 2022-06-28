import { Router } from "express";
import { apiRoute } from "./api";

export const defaultRoute = Router();

defaultRoute.get("/", (_req, res) => {
  res.redirect("/api/status");
});
defaultRoute.use("/api", apiRoute);
