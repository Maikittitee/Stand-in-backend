import { Router } from 'express';
import { validate_jwt, validate_account } from '../middleware/auth.js';


export default Router()
    .use(validate_jwt)
    .use(validate_account())


.get('/user', async (req: AccountRequest, res, next) => {
    const account = req.auth!.user;
    const user = await account.populate('user');
    // ...

    res.json(user);
})

.post('/user', async (req: AccountRequest, res, next) => {
    const account = req.auth!.user;
    const user = await account.populate('user');

    res.json(user);
})

.get('/profile', async (req: AccountRequest, res, next) => {
    const account = req.auth!.user;

    try {
        account.profile = req.body;
        account.save();
    }
    catch (error) {
        res.status(400);
        return;
    }

    res.json(account.profile);
})

.post('/profile', async (req: AccountRequest, res, next) => {
    const account = req.auth!.user;

    res.json(account.profile);
})