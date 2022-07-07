import { Router, Request, Response } from "express";
import { canUpload } from "../../utils/routeFunctions";
import { formidable } from "formidable";
import { getNextUploadId, getUser, insertUpload } from "../../db";
import { join } from "path";
import config from "../../config";
export const uploadRoute = Router();

uploadRoute.post("/", canUpload, async (req: Request, res: Response) => {
  const user = await getUser({ authToken: req.query["token"] as string }).catch(
    () => null
  );
  const isPrivate = (req.query["private"] as string) !== "true";
  if (user === null) return res.status(401).send("Invalid token");
  formidable({
    uploadDir: join(__dirname, "../../../storage"),
    keepExtensions: true,
    allowEmptyFiles: false,
  }).parse(req, async (err, _fields, files) => {
    if (err) {
      res.writeHead(err.httpCode || 400, { "Content-Type": "text/plain" });
      res.end(String(err));
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    const upload = await insertUpload({
      name:
        files.file instanceof Array
          ? files.file[0].newFilename
          : files.file.newFilename,
      uploadId: await getNextUploadId(),
      uploadedBy: user,
      uploadedOn: new Date(),
      isPublic: isPrivate,
      url: (config.ssl? "https://": "http://") + config.fqdn + (user.folderName === "/" ? "" : user.folderName) + (user.folderName === "/" ? "" : "/") + (files.file instanceof Array? files.file[0].newFilename: files.file.newFilename),
      filename:
        files.file instanceof Array
          ? files.file[0].newFilename
          : files.file.newFilename,
    });
    res.end(
      JSON.stringify({
        url: upload.url,
        delete_url:
          ((config.ssl? "https://": "http://" + config.fqdn + "/api/delete/" + upload.uploadId) as string) + "?token=" + user.authToken,
      })
    );
  });
});
