import { Schema, model } from 'mongoose';


export const addressSchema = new Schema({
    country: {
        type: String,
        default: 'Thailand',
    },
    zipcode: {
        type: String,
        default: '',
    },
    province: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true,
    },
    subdistrict: {
        type: String,
        required: true,
    },
    detail: {
        type: String,
        default: '',
    },
}, {
    _id: false
});


export const buildingSchema = new Schema({
    name: {
        type: String,
    },
    address: {
        type: addressSchema,
        required: true,
    },
});


export const storeSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    building: {
        type: Schema.Types.ObjectId,
        ref: 'Building',
        required: true,
    },
});


// https://en.wikipedia.org/wiki/Thai_addressing_system

export const Store = model('Store', storeSchema);
export const Building = model('Building', buildingSchema);