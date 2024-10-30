import { Schema, model } from 'mongoose';
import { addressSchema } from './Address.js';


export enum Role {
    Default,
    Customer,
    Stander,
}


const profileSchema = new Schema({
    name: {
        type: String,
    },
    image: {
        type: String,
    },
    phone: {
        type: String,
    },
    address: {
        type: Map,
        of: addressSchema,
        default: new Map(),
    },
    // creditcard?: {
    //     number: String;
    // }
}, {
    timestamps: { createdAt: false, updatedAt: true},
});


export const accountSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    profile: {
        type: profileSchema,
        default: {},
    },
    role: {
        type: Number,
        enum: Role,
        required: true,
    },
}, {
    timestamps: true,
    discriminatorKey: 'role',
});


export function isStander(account: any): account is TStander {
    return account.role === Role.Stander;
}
export function isCustomer(account: any): account is TCustomer {
    return account.role === Role.Customer;
}


export const Account = model('Account', accountSchema);