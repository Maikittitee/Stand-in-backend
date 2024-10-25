import 'dotenv/config';
import { Role } from '../model/Account.js';
import { TrackStatus } from '../model/Order.js';


async function request(path: string, option?: {}) {
    const res = await fetch(DOMAIN + path, option);

    const { url, status, headers } = res;
    console.log('\n\n\nResponse:', { url, status, headers });

    if (headers.get('content-type')?.includes('application/json')) {
        content = await res.json();
        console.log('Response Body:', content);

        return content;
    }
}

async function get(path: string, query = {}, headers?: {}) {
    if (Object.keys(query).length > 0) {
        path += '?' + new URLSearchParams(query);
    }

    return await request(path, { headers });
}

async function post(path: string, body = {}, headers?: {}) {
    return await request(path, {
        method: 'POST',
        body: JSON.stringify(body),
        headers,
    });
}


const PORT = process.env.PORT || 3000;
const DOMAIN = `http://localhost:${PORT}`;
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



content = await get('/user', {}, CustomerHeader);

content = await post('/user',
    { email: 'newemail@mail.com'},
    CustomerHeader
);

content = await get('/user', {}, CustomerHeader);



content = await get('/user/profile', {}, CustomerHeader);

content = await post('/user/profile', {
    name: 'test customer 1',
    phone: '01012345678',
    image: 'https://cdn.britannica.com/68/178268-050-5B4E7FB6/Tom-Cruise-2013.jpg'
}, CustomerHeader);

content = await get('/user/profile', {}, CustomerHeader);



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


content = await get('/stander/history', {}, StanderHeader);

content = await post('/customer/order', {
    stander: content._id,
    task: {
        store: products[0].store,
        items: [
            { product: products[0]._id, quantity: 5 },
        ],
    },
}, CustomerHeader);

let order = content;

content = await get('/stander/history', {}, StanderHeader);


content = await get('/customer/history', {}, CustomerHeader);

content = await post(`/stander/order/${order._id}/accept`, {}, StanderHeader);

content = await get('/customer/history', {}, CustomerHeader);

content = await post(`/customer/order/${order._id}/pay`, {}, CustomerHeader);

content = await get('/customer/history', {}, CustomerHeader);


content = await post(`/stander/order/${order._id}/tracking`, {}, StanderHeader);

content = await post(`/stander/order/${order._id}/tracking`, {}, StanderHeader);

content = await post(`/stander/order/${order._id}/tracking`, {}, StanderHeader);

content = await post(`/stander/order/${order._id}/tracking`, {
    status: TrackStatus.Delivered,
}, StanderHeader);



content = await post(`/customer/order/${order._id}/review`, {
    rating: 5,
    comment: 'good'
}, CustomerHeader);

content = await get('/customer/history', {}, CustomerHeader);