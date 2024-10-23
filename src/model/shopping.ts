import { Schema, model } from 'mongoose';


export const itemSchema = new Schema({
	product: { 
		type: Schema.Types.ObjectId, 
        ref: 'Product',
        required: true,
    },
    subproduct: {
		type: Number,
        required: true,
    },
    quantity: { 
		type: Number, 
        min: 1,
        required: true,
    },
});


export interface ShoppingTaskType {
	store: string
	items: Array<Schema>,
}

export const shoppingTaskSchema = new Schema({
	store: { 
        type: Schema.Types.ObjectId, 
        ref: 'Store',
        required: true,
    },
    items: [itemSchema],
});


export const ShoppingTask = model('ShoppingTask', shoppingTaskSchema);
export default ShoppingTask