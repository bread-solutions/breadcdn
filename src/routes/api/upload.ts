import { Router, Request, Response } from "express";
import { canUpload } from "../../utils/routeFunctions";
import { formidable } from 'formidable';
export const uploadRoute = Router();

uploadRoute.post("/", canUpload, (req: Request, res: Response) => {
  formidable({uploadDir: 'storage', keepExtensions: true, allowEmptyFiles: false, }).parse(req, (err, fields, files) => {
    if(err) {
      res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
        res.end(String(err));
        return;
    }
    console.log(files.file);
    res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ fields, files }, null, 2));
  });
});