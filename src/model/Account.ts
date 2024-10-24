import { Schema, model } from 'mongoose';
import { addressSchema } from './Address.js';


export enum Role {
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
    },
    // creditcard?: {
    //     number: String;
    // }
}, {
    timestamps: true,
});


export const accountSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    profile: {
        type: profileSchema,
        required: true,
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