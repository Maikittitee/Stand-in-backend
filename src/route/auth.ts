import 'dotenv/config';
import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

import { User } from "../model/User.js";
import { Account, Role } from "../model/Account.js";
import { roleMap } from '../middleware/auth.js';


interface SignUpRequestBody {
    username: string;
    password: string;
    email: string;
}


const router = express.Router();

router.post('/sign-up', async (req: Request, res: Response) => {
    const { role, ...user_body } = req.body as { role: Role } & SignUpRequestBody;
    const AccountModel = roleMap.get(role);

    console.log({ role, user_body });
    if (AccountModel === undefined) {
        res.status(400).end();
        return;
    }

    try {
        var user = await User.create(user_body);
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