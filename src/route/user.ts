import { Router } from 'express';
import { validate_jwt, validate_account } from '../middleware/auth.js';
import bcrypt from "bcrypt";
import { User } from '../model/User.js';


export default Router()
    .use(validate_jwt)
    .use(validate_account())


.get('/user', async (req: AccountRequest, res) => {
    const account = req.auth!.user;
    const user = (await User.findById(account.user))!;

    res.json({
        username: user.username,
        email: user.email,
    });
})

.post('/user', async (req: AccountRequest, res) => {
    const account = req.auth!.user;
    const { username, email } = req.body;

    let user
    try {
        user = await User.findByIdAndUpdate(account.user, {
            username,
            email,
            // password: await bcrypt.hash(user_data.password, 10),
        });
    }
    catch (error) {
        res.status(400);
        return;
    }

    res.json(user);
})

.get('/profile', async (req: AccountRequest, res) => {
    const account = req.auth!.user;

    res.json(account.profile);
})

.post('/profile', async (req: AccountRequest, res) => {
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