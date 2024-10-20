import { NextFunction, Response } from 'express';
import { expressjwt, Request } from 'express-jwt';
import { Account, Role } from '../model/Account.js';


export const validate_jwt: middleware = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'] // default 'jsonwebtoken' algorithm, HMAC SHA256
});

export function validate_account(role: Role) {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (req.auth == undefined) {
            res.status(401)
            return;
        }

        const user = await Account.findOne({
            user: {
                username: req.auth.username,
            },
            role: role
        });

        if (user == null) {
            res.status(401)
            return;
        }

        req.auth.user = user;
        next();
    }
}