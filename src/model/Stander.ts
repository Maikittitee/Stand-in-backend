import { Schema, model } from 'mongoose';
import { Order } from './Order.js';
import { PackageSize } from './Task.js';
import { Account, accountOption } from './Account.js';


const serviceSchema = new Schema({
    queueing: {
        available: {
            type: Boolean,
            default: false,
            required: true,
        },
        pricing: [{
            package: {
                type: Number,
                enum: PackageSize,
            },
            charge: {
                type: Number,
                required: true,
            },
        }],
        description: {
            type: String,
        },
    },
    shopping: {
        available: {
            type: Boolean,
            default: false,
            required: true,
        },
        charge: {
            type: Number,
            required: true,
        },
    },
    // stander: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Stander',
    //     required: true,
    // },
});


const standerSchema = new Schema({
    commission: {
        type: Schema.Types.ObjectId,
        ref: 'Commission',
        required: true,
    },
}, {
    virtuals: {
        history: {
            get() {
                return Order.find({ stander: this._id });
            }
        },
    },
    ...accountOption,
});


export const Service = model('Service', serviceSchema);
export const Stander = Account.discriminator('Stander', standerSchema);