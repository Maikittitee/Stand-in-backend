import { Router } from 'express';
import { convertQuery } from '../../middleware/validator.js';

import product from './product.js';
import stander from './stander.js';
import browse from './public.js';


export default Router()
    .use(convertQuery)
    .use(browse)
    .use('/product', product)
    .use('/stander', stander)