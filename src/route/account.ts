import { Router } from 'express';
import { validate_jwt, validate_account } from '../middleware/auth.js';

import { User } from '../model/User.js';
import { Account } from '../model/Account.js';
import { ToNestedPath } from '../service/index.js';


export default Router()
    .use(validate_jwt)
    .use(validate_account())


.get('/', async (req: AccountRequest, res) => {
    const account_id = req.auth!.account_id;

    res.json(account_id);
})

.get('/user', async (req: AccountRequest, res) => {
    const account = req.auth!.account;
    const user = await User.findById(account.user);

    res.json({
        username: user!.username,
        email: user!.email,
    });
})

.post('/user', async (req: AccountRequest, res) => {
    const account = req.auth!.account;

    try {
        var user = await User.findByIdAndUpdate(account.user, req.body)
    }
    catch (error) {
        res.status(400).end();
        return;
    }

    res.json({
        username: user!.username,
        email: user!.email,
    });
})

.get('/profile', async (req: AccountRequest, res) => {
    const account = req.auth!.account;

    res.json(account.profile);
})

.post('/profile', async (req: AccountRequest, res) => {
    const account_id = req.auth!.account_id;

    try {
        var account = await Account.findByIdAndUpdate(
            account_id, ToNestedPath(req.body, 'profile'),
            { new: true }
        );
    }
    catch (error) {
        res.status(400).end();
        return;
    }

    res.json(account!.profile);
})