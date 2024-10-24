import 'dotenv/config';
import express, { Request, Response } from "express";
import { Model } from 'mongoose';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

import { User } from "../model/User.js";
import { Account, Role } from "../model/Account.js";
import { Customer } from '../model/Customer.js';
import { Stander } from '../model/Stander.js';


interface SignUpRequestBody {
    username: string;
    password: string;
    email: string;
}

const roleMap = new Map<Role, Model<any>>([
    [Role.Customer, Customer],
    [Role.Stander, Stander],
]);


const router = express.Router();

router.post('/sign-up', async (req: Request, res: Response) => {
    const { user: user_body, role } = req.body as { user: SignUpRequestBody, role: Role };
    const AccountModel = roleMap.get(role);

    if (AccountModel === undefined) {
        res.status(400).end();
        return;
    }

    let user;
    try {
        user = await User.create({
            username: user_body.username,
            password: await bcrypt.hash(user_body.password, 10),
            email: user_body.email,
        });
    }
    catch (error) {
        res.status(400).json({ error });
        return;
    }

    const account = await AccountModel.create({ user: user._id });
    const token = jwt.sign(
        { account_id: account._id },
        process.env.SECRET,
        { expiresIn: "1h" }
    );

    res.json({ token });
});

router.post('/sign-in', async (req: Request, res: Response) => {
    const { username, password } = req.body as { username: string; password: string };

    const user = await User.findOne({ username });
    if (user === null) {
        res.status(400).json({
            message: "Login Failed (user not found)"
        });
        return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        res.status(400).json({
            message: "Login Failed (wrong username or password)"
        });
        return;
    }

    const account = await Account.findOne({ user: user._id });
    if (account === null) {
        res.status(400).end();
        return;
    }

    const token = jwt.sign(
        { account_id: account._id },
        process.env.SECRET,
        { expiresIn: "1h" }
    );

    res.json({
        message: "Login success",
        role: account.role,
        token
    });
});


export default router;