import { Schema, model } from 'mongoose';
import { addressSchema } from './address.js';


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


const accountSchema = new Schema({
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


export const Account = model('account', accountSchema);