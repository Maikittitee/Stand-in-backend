import '../../server.js'
import { get, post } from './index.js';

import { Role } from '../../model/Account.js';
import { TrackStatus } from '../../model/Order.js';
import { TaskType } from '../../model/Task.js';


const StanderHeader = {
    'Content-Type': 'application/json; charset=utf-8',
};
const CustomerHeader = {
    'Content-Type': 'application/json; charset=utf-8',
};
let content: any;



content = await post('/auth/sign-up', {
    username: 'ts1',
    password: 'test',
    email: 'ts1@gmail.com',
    role: Role.Stander,
}, StanderHeader);

content = await post('/auth/sign-up', {
    username: 'tc1',
    password: 'test',
    email: 'tc1@gmail.com',
    role: Role.Customer,
}, CustomerHeader);



content = await post('/auth/sign-in', {
    username: 'ts1',
    password: 'test',
}, StanderHeader);

StanderHeader['Authorization'] = `Bearer ${content.token}`;

content = await post('/auth/sign-in', {
    username: 'tc1',
    password: 'test',
}, CustomerHeader);

CustomerHeader['Authorization'] = `Bearer ${content.token}`;



content = await get('/account', {}, StanderHeader);
let stander_id = content;

content = await get('/account/user', {}, CustomerHeader);

content = await post('/account/user',
    { email: 'newemail@mail.com'},
    CustomerHeader
);

content = await get('/account/user', {}, CustomerHeader);



content = await get('/account/profile', {}, CustomerHeader);

content = await post('/account/profile', {
    name: 'test customer 1',
    phone: '01012345678',
    image: 'https://cdn.britannica.com/68/178268-050-5B4E7FB6/Tom-Cruise-2013.jpg'
}, CustomerHeader);

content = await get('/account/profile', {}, CustomerHeader);



content = await get('/browse/product');

let products = content;

content = await get(`/browse/product/${products[0]._id}`);

content = await get(`/browse/product/${products[1]._id}`);



content = await get('/customer/cart', {}, CustomerHeader);

content = await post('/customer/cart', {
    product: products[0]._id,
    quantity: 1,
}, CustomerHeader);

content = await post('/customer/cart', {
    product: products[1]._id,
    quantity: 3,
}, CustomerHeader);

content = await get('/customer/cart', {}, CustomerHeader);



content = await get('/browse/stander');

content = await get(`/browse/stander/${content[0]._id}`);

content = await get('/stander/order', {}, StanderHeader);

content = await post('/customer/order', {
    stander: stander_id,
    task: {
        kind: TaskType.Shopping,
        store: products[0].store,
        items: [
            { product: products[0]._id, quantity: 5 },
        ],
    },
}, CustomerHeader);

let order = content;

content = await get('/stander/order', {}, StanderHeader);



content = await get('/customer/order', {}, CustomerHeader);

content = await post(`/stander/order/${order._id}/accept`, {}, StanderHeader);

content = await get('/customer/order', {}, CustomerHeader);

content = await post(`/customer/order/${order._id}/pay`, {}, CustomerHeader);

content = await get('/customer/order', {}, CustomerHeader);

content = await post(`/stander/order/${order._id}`, {}, StanderHeader);

content = await post(`/stander/order/${order._id}`, {}, StanderHeader);

content = await post(`/stander/order/${order._id}`, {}, StanderHeader);

content = await post(`/stander/order/${order._id}`, {
    status: TrackStatus.Delivered,
}, StanderHeader);



content = await post(`/customer/order/${order._id}/review`, {
    rating: 5,
    comment: 'good'
}, CustomerHeader);

content = await get('/customer/order', {}, CustomerHeader);



process.exit(0);