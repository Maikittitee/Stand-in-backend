import { Schema } from 'mongoose';
import { Order } from './Order.js';
import { itemSchema } from './Product.js';
import { Account, accountOption } from './Account.js';


export const customerSchema = new Schema({
    cart: [itemSchema],
}, {
    virtuals: {
        history: {
            get() {
                return Order.find({ customer: this._id });
            }
        },
    },
    // ...accountOption,
});


export const Customer = Account.discriminator('Customer', customerSchema);