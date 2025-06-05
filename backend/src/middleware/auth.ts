import { NextFunction, Request, Response } from "express";
import {findUserByToken} from "../model/User";


export interface RequestWithUser extends Request {
    user?: any;
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.get("Authorization");
    if (!token) {
         res.status(401).json({ error: "No token present" });
        return
    }

    const user = await findUserByToken(token);
    if (!user) {
         res.status(401).json({ error: "Wrong token" });
        return
    }

    (req as RequestWithUser).user = user;
    next();
};

export default auth;