import { NextFunction, Response } from 'express';
import { expressjwt, Request } from 'express-jwt';
import { Model } from 'mongoose';

import { Account, Role } from '../model/Account.js';
import { Customer } from '../model/Customer.js';
import { Stander } from '../model/Stander.js';


export const roleMap = new Map<Role, Model<any>>([
    [Role.Default, Account],
    [Role.Customer, Customer],
    [Role.Stander, Stander],
]);


export const validate_jwt: middleware = expressjwt({
    secret: process.env.SECRET,
    algorithms: ['HS256'] // default 'jsonwebtoken' algorithm, HMAC SHA256
});

export function validate_account(role: Role = Role.Default) {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (req.auth === undefined) {
            res.status(401).end();
            return;
        }

        const AccountModel = roleMap.get(role)!;
        const account = await AccountModel.findById(req.auth.account_id);

        if (account === null) {
            res.status(401).end();
            return;
        }

        req.auth.account = account;
        next();
    }
}