import { Router } from 'express';
import { validate_jwt, validate_account } from '../middleware/auth.js';

import { User } from '../model/User.js';
import { Account } from '../model/Account.js';
import { convertSubdoc } from '../service/index.js';


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
    let user

    try {
        user = await User.findByIdAndUpdate(account.user, req.body)
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
    const account_id = req.auth!.account_id;

    let account;
    try {
        account = await Account.findByIdAndUpdate(
            account_id, convertSubdoc(req.body, 'profile'),
            { new: true }
        );
    }
    catch (error) {
        res.status(400).end();
        return;
    }

    res.json(account!.profile);
})