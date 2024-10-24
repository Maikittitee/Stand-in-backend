import { Schema, model } from 'mongoose';
import { Order } from './Order.js';
import { Account, Role } from './Account.js';


export const standerSchema = new Schema({
    queueing: {
        available: {
            type: Boolean,
            default: false,
        },
        charge: {
            type: Map, // key should be PackageSize
            of: Number
        },
        description: {
            type: String,
        },
    },
    shopping: {
        available: {
            type: Boolean,
            default: false,
        },
        charge: {
            type: Number,
            required: true,
        },
    },
}, {
    methods: {
        async getHistory() {
            return await Order.find({ stander: this._id });
        },
        async getScore() {
            // @ts-ignore
            const orders: TOrder[] = await this.getHistory();
            const hasReview = orders.filter(order => order.review !== undefined);

            if (hasReview.length == 0) {
                return;
            }

            const sum = hasReview.reduce((s, order) => s + order.review!.rating, 0);

            if (sum == 0) {
                return 0;
            }

            return sum / orders.length;
        },
    },
});


// @ts-ignore
export const Stander: ModelFromSchema<TStanderSchema> = Account.discriminator(Role.Stander, standerSchema);