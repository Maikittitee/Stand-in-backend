import { Schema, model} from 'mongoose';
import { addressSchema } from './Address.js';


export enum Role {
    Customer,
    Stander,
}


export const accountOption = {
    timestamps: true,
    discriminatorKey: 'role',
}


export const profileSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    phone: {
        type: String,
        required: true,
    },
    address: [{
        label: String,
        value: addressSchema,
    }],
    // creditcard?: {
    //     number: String;
    // }
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
        required: true,
        enum: Role,
    },
}, accountOption);


export function isStander(account: any): account is TStander {
    return account.role === Role.Stander;
}
export function isCustomer(account: any): account is TCustomer {
    return account.role === Role.Customer;
}


export const Account = model('Account', accountSchema);