import assert from 'assert';
import * as fuzz from 'fuzzball';
import { Building, Store } from '../../model/Address.js';
import { Order, OrderStatus, TrackStatus } from '../../model/Order.js';
import { Brand, Product, ProductModel } from '../../model/Product.js';
import { TaskType, PackageSize } from '../../model/Task.js';

import './connection.js';


const building1 = await Building.findOne({ name: 'Siam Paragon' });
const store1 = await Store.findOne({ name: 'Music Collection' });

console.log(building1);
console.log(store1);
assert(store1?.building?._id.equals(building1?._id));

console.log(await store1?.populate('building'));


const brand1 = await Brand.findOne({ name: 'Crafter' });
const productModel1 = await ProductModel.findOne({ name: 'TMC-035EQ' });

console.log(brand1);
console.log(productModel1);
assert(brand1?._id.equals(productModel1?.brand._id));

console.log(await productModel1?.populate('brand'));


const product1 = await Product.findOne({ model: productModel1?.id });
console.log(product1);

const product2 = await product1?.populate('model');
console.log(product2);

const product3 = await product2?.populate('store');
console.log(product3);

// const product4 = await product3?.populate('subproduct');
// console.log(product4);


const order = await Order.find();
console.log(order[0]);
console.log(order[1]);


// test undefined key
let params = {};
// @ts-expect-error
const products = await Product.find({ name: params.name });
console.log(products);


// find by string id
const pid = product1?._id.toString();
console.log(await Product.find({ _id: pid }));



const documents = [
    { id: 1, name: 'Apple iPhone 12' },
    { id: 2, name: 'Samsung Galaxy S21' },
    { id: 3, name: 'Google Pixel 5' },
    { id: 4, name: 'OnePlus 9' },
];
const query = [
    'iphone',
    'sam',
    'galexy',
    'pixl',
    'plas',
    'gogal',
]
const options = {
    scorer: fuzz.partial_ratio,
    // @ts-expect-error
    processor: d => d.name,
    cutoff: 50,
}
console.log('Search results:');
for (const q of query) {
    let x = fuzz.extract(q, documents, options);
    console.log(x);
}


process.exit(0);