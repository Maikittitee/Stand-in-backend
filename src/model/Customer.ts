import { Schema } from 'mongoose';
import { Order } from './order.js';
import { itemSchema } from './product.js';
import { Account, accountOption } from './Account.js';


const customerSchema = new Schema({
    cart: [itemSchema],
}, {
    virtuals: {
        history: {
            get() {
                return Order.find({ customer: this._id });
            }
        },
    },
    ...accountOption,
});


export const Customer = Account.discriminator('Customer', customerSchema);