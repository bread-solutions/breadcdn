export default interface IUser {
  id: number;
  whitelisted: boolean;
  username: string;
  email: string;
  discordId: string;
  authToken: string;
  folderName: string;
  createdOn: Date;
}
