import { HydratedDocumentFromSchema } from 'mongoose';
import { accountSchema } from '../model/Account.js';
import { standerSchema } from '../model/Stander.js';
import { customerSchema } from '../model/Customer.js';
import { queueingSchema, shoppingSchema } from '../model/Task.js';

declare global {
    type TStander = HydratedDocumentFromSchema<typeof standerSchema>;
    type TCustomer = HydratedDocumentFromSchema<typeof customerSchema>;
    type TQueueing = HydratedDocumentFromSchema<typeof queueingSchema>;
    type TShopping = HydratedDocumentFromSchema<typeof shoppingSchema>;
}