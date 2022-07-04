import { Router, Request, Response } from "express";
import { deleteUpload, getUpload } from "../../db";
import { isSameUser } from "../../utils/routeFunctions";
import { unlinkSync } from "fs";
import { join } from "path";
export const deleteRoute = Router();

deleteRoute.get(
  "/:photoId",
  isSameUser,
  async (req: Request, res: Response) => {
    const photoId = req.params.photoId;
    const photoUpload = await getUpload({ uploadId: Number(photoId) }).catch(
      () => null
    );
    if (!photoId || photoId.length === 0)
      return res.status(400).send("No photoId provided");
    if (!photoUpload) return res.status(404).send("Photo not found");
    const photoOwner = photoUpload.uploadedBy;
    if (!photoOwner) return res.status(404).send("Photo not found");
    try {
      unlinkSync(
        `${join(__dirname, "../../../storage")}/${
          photoOwner.folderName + photoOwner.folderName === "/" ? "" : "/"
        }${photoUpload.filename}`
      );
    } catch {
      return res.status(500).send("Error deleting photo");
    }
    deleteUpload({ uploadId: Number(photoId) });
    res.status(200).send("Photo deleted");
  }
);
