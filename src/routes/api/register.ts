import { Router, Request, Response } from "express";
import { getInviteToken, getNextUserId, insertUser } from "../../db";

export const resgisterRoute = Router();
resgisterRoute.post("/", async (req: Request, res: Response) => {
    if(req.headers["content-type"] !== "application/json") {return res.writeHead(400, {'Content-Type': 'application/json'}).end({error: "Invalid Content-Type", statusCode: 400});}
    const { inviteKey } = req.query;
    const {username, email, discordId, whitelisted} = req.body;
    if(!inviteKey) return res.writeHead(400, { "Content-Type": "application/json" }).end({ error: "No invite key provided", statusCode: 400 });
    if(!username || !email || !discordId) return res.writeHead(400, { "Content-Type": "application/json" }).end({ error: "No username, email, or discordId provided", statusCode: 400 });
    await getInviteToken(inviteKey as string).catch((err) =>{if(err === "NO_TOKEN_FOUND") return res.writeHead(400, { "Content-Type": "application/json" }).end({ error: "Invalid invite key", statusCode: 400 }); throw err;});
    await insertUser({
        username,
        email,
        discordId,
        folderName: "/",
        authToken: Math.random().toString(36).substring(2, 15),
        createdOn: new Date(),
        id: await getNextUserId(),
        whitelisted: whitelisted ?? true
    }).then(() => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, statusCode: 200 }));
    }).catch((err) => {
        console.error(err);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Errored while trying to create user", statusCode: 400 }));
    });
});