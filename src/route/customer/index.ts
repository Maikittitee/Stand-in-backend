import { Router } from 'express';
import { validate_jwt, validate_account } from '../../middleware/auth.js';
import { Role } from '../../model/Account.js';
import cart from './cart.js';
import order from './order.js';


export default Router()
    .use(validate_jwt)
    .use(validate_account(Role.Customer))
    .use('/cart', cart)
    .use('/order', order)