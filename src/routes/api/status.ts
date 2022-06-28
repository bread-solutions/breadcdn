import { Router } from "express";
export const statusRoute = Router();
statusRoute.get("/", (_req, res) => {
  res.send({
    status: "ok",
    version: "0.0.1",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    pid: process.pid,
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    message: "PIMP SHIT YERRR",
  });
});
