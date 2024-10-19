import { Schema, model, Types } from 'mongoose';


export interface IAddress extends Types.Subdocument {
    country: string;
    zipcode: string;
    province: string;
    district: string;
    subdistrict: string;
    detail: string;
}
export const addressSchema = new Schema<IAddress>({
    country: { 
        type: String, 
        default: 'Thailand',
        required: true,
    },
    zipcode: {
        type: String,
        required: true,
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
        required: true,
    },
}, { 
    _id: false 
});


const buildingSchema = new Schema({
    name: {
        type: String,
    },
    address: {
        type: addressSchema,
        required: true,
    },
});


const storeSchema = new Schema({
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