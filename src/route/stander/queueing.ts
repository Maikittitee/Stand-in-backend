import { Router } from 'express';


export default Router()
    .get('/', async (req: StanderRequest, res) => {
        const stander = req.auth!.account;

        // ...
        res.json();
    })