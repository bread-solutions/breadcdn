import express from "express";
import { defaultRoute } from "./routes";
const expressApp = express();
expressApp.use(express.static("storage"));
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));
expressApp.use("/", defaultRoute);
expressApp.listen(18133, () => {
  console.log("Server started on port 18133");
});
