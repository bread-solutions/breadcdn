import express, { Request, Response } from "express";
import { join } from "path";
import config from "./config";
import { defaultRoute } from "./routes";
const expressApp = express();
expressApp.use('/static', express.static(join(__dirname, "./static")));
expressApp.use(express.static(join(__dirname, "../storage")));
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));
expressApp.use("/", defaultRoute);
expressApp.all("/discord", (_req, res) => {return res.redirect("https://discord.gg/breadsln")});
expressApp.listen(config.port, () => {
  console.log("Server started on port " + config.port);
});
