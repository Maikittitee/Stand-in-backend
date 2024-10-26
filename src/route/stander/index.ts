import { Router } from 'express';
import { validate_jwt, validate_account } from '../../middleware/auth.js';
import { Role } from '../../model/Account.js';
import order from './order.js';
import queueing from './queueing.js';
import shopping from './shopping.js';


export default Router()
    .use(validate_jwt)
    .use(validate_account(Role.Stander))
    .use('/queueing', queueing)
    .use('/shopping', shopping)
    .use('/order', order)