import { Router, Request, Response } from "express";
import { post, get } from 'superagent';
import config from "../../config";
import { getUser } from "../../db";
export const loginRoute = Router();

loginRoute.get('/', async (req: Request, res: Response) => {
    const { code } = req.query;
    if(!code) return res.redirect('/');
    const data = {
        client_id: config.discord.client_id,
        client_secret: config.discord.client_secret,
        grant_type: "authorization_code",
        code,
        redirect_uri: (config.ssl? "https://" : "http://") + config.fqdn + (config.ssl? "" : ":" + config.port) + "/api/login"
    }
    const postReq = await post("https://discordapp.com/api/oauth2/token").set("Content-Type", "application/x-www-form-urlencoded").send(data).catch((err) => {  
    if( err.status === 400) {
            res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid Code", statusCode: 400 }));
        } else {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Internal Server Error", statusCode: 500 }));
        }
    });
    if(postReq && postReq.statusCode === 200) {
        const { access_token } = postReq.body;
        const discordReq = await get("https://discordapp.com/api/users/@me").set("Authorization", `Bearer ${access_token}`);
        if(discordReq.statusCode === 200) {
            const { id } = discordReq.body;
            const user = await getUser({discordId: id}).catch(() => null);
            if(user) {
                console.log(user);
                // do session stuff to set session via jwt
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true, statusCode: 200 }));
            }
        }
    }
});