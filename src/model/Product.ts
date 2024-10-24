import { Schema, model } from 'mongoose';


export const Category = [
    'Clothing',
    'Beauty',
    'Electronics',
    'Home',
    'Stationery',
    'Toys & Games',
];


export const brandSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    logo: {
        type: String,
    },
});


export const modelSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'Brand',
        required: true,
    },
    category: {
        type: String,
        enum: Category,
    },
    description: {
        type: String,
    },
});


export const variantSchema = new Schema({
    images: [String],
    product_model: {
        type: Schema.Types.ObjectId,
        ref: 'ProductModel',
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
    options: {
        type: Map,
        of: String,
        default: {},
    }
});


export const productSchema = new Schema({
    store: {
        type: Schema.Types.ObjectId,
        ref: 'Store',
        required: true,
    },
    variant: {
        type: Schema.Types.ObjectId,
        ref: 'ProductVariant',
        required: true,
    },
    available: {
        type: Boolean,
        required: true,
    },
});


export const itemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        min: 1,
        required: true,
    },
}, {
    _id: false,
});


// https://www.mongodb.com/community/forums/t/product-with-different-varients-schema/136631
// https://stackoverflow.com/questions/42295107/mongodb-schema-for-ecommerce-products-that-have-variations-with-different-skus
// https://stackoverflow.com/questions/24923469/modeling-product-variants

export const Brand = model('Brand', brandSchema);
export const ProductVariant = model('ProductVariant', variantSchema);
export const ProductModel = model('ProductModel', modelSchema);
export const Product = model('Product', productSchema);