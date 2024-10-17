import { NextFunction, Response } from "express";
import { expressjwt, Request } from "express-jwt";


export const validate_jwt: middleware = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'] // default jwt algorithm, HMAC SHA256
});

export function check_auth (req: Request, res: Response, next: NextFunction) {
    if (!req.auth) {
        res.status(401)
        return;
    }
    next();
}