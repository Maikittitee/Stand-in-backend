import { Router } from 'express';

import customer from './customer/index.js';
import stander from './stander/index.js';
import browse from './browse/index.js';
import account from './account.js';
import auth from './auth.js';
import constant from './enum.js'


export default Router()
    .use('/auth', auth)
    .use('/enum', constant)
    .use('/account', account)
    .use('/customer', customer)
    .use('/stander', stander)
    .use('/browse', browse)