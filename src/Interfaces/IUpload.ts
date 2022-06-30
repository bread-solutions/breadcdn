import IUser from "./IUser";

export default interface IUpload {
  uploadId: number;
  uploadedBy: IUser;
  uploadedOn: Date;
  isPublic: boolean;
  name: string;
  url: string;
  filename: string;
}
