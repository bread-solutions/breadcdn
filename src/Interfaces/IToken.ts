import IUser from "./IUser";

export default interface IToken {
    token: string,
    createdOn: Date,
    createdBy: IUser,
    expiresOn: Date,
    isActive: boolean,
}