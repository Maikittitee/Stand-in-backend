import { Router } from 'express';
import { validate_jwt, validate_account } from '../middleware/auth.js';
import bcrypt from "bcrypt";
import { User } from '../model/User.js';


export default Router()
    .use(validate_jwt)
    .use(validate_account())


.get('/user', async (req: AccountRequest, res) => {
    const account = req.auth!.account;
    const user = (await User.findById(account.user))!;

    res.json({
        username: user.username,
        email: user.email,
    });
})

.post('/user', async (req: AccountRequest, res) => {
    const account = req.auth!.account;
    let { username, email, password } = req.body;
    let user

    try {
        if (password !== undefined) {
            password = await bcrypt.hash(password, 10);
        }
        user = await User.findByIdAndUpdate(account.user, { username, email, password });
    }
    catch (error) {
        res.status(400).end();
        return;
    }

    res.json(user);
})

.get('/profile', async (req: AccountRequest, res) => {
    const account = req.auth!.account;

    res.json(account.profile);
})

.post('/profile', async (req: AccountRequest, res) => {
    const account = req.auth!.account;

    try {
        account.profile = req.body;
        account.save();
    }
    catch (error) {
        res.status(400).end();
        return;
    }

    res.json(account.profile);
})