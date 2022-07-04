import express from "express";
import { defaultRoute } from "./routes";
const expressApp = express();
expressApp.use(express.static("storage"));
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));
expressApp.use("/", defaultRoute);
expressApp.all("/", (_req, res) => {return res.redirect("https://discord.gg/JckpxefJzu")});
expressApp.listen(18133, () => {
  console.log("Server started on port 18133");
});
