import { Schema } from 'mongoose';
import { Order } from './Order.js';
import { itemSchema } from './Product.js';
import { Account, Role } from './Account.js';


export const customerSchema = new Schema({
    cart: [itemSchema],
}, {
    methods: {
        async getHistory() {
            return await Order.find({ customer: this._id });
        },
    },
});


// @ts-ignore
export const Customer: ModelFromSchema<TCustomerSchema> = Account.discriminator(Role.Customer, customerSchema);