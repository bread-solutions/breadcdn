import { Router } from "express";
import { deleteRoute } from "./delete";
import { loginRoute } from "./login";
import { resgisterRoute } from "./register";
import { statusRoute } from "./status";
import { uploadRoute } from "./upload";

export const apiRoute = Router();
apiRoute.get('/', statusRoute);
apiRoute.use("/status", statusRoute);
apiRoute.use("/upload", uploadRoute);
apiRoute.use("/delete", deleteRoute);
apiRoute.use("/login", loginRoute);
apiRoute.use("/register", resgisterRoute);
