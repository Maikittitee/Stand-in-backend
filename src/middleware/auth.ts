import { NextFunction, Response } from 'express';
import { expressjwt, Request } from 'express-jwt';
import { Account, Role } from '../model/Account.js';


export const validate_jwt: middleware = expressjwt({
    secret: process.env.SECRET,
    algorithms: ['HS256'] // default 'jsonwebtoken' algorithm, HMAC SHA256
});

export function validate_account(role?: Role) {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (req.auth === undefined) {
            res.status(401).end();
            return;
        }

        const account = await Account.findOne({
            _id: req.auth.account_id,
            role: role
        });

        if (account === null) {
            res.status(401).end();
            return;
        }

        req.auth.account = account;
        next();
    }
}