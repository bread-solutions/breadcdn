import { Router } from "express";
import { statusRoute } from "./status";
import { uploadRoute } from "./upload";

export const apiRoute = Router();

apiRoute.use("/status", statusRoute);
apiRoute.use("/upload", uploadRoute);
