// import '../../server.js'
import { get, post } from './index.js';

import { Role } from '../../model/Account.js';
import { TrackStatus } from '../../model/Order.js';
import { PackageSize, TaskType } from '../../model/Task.js';


const StanderHeader = {
    'Content-Type': 'application/json; charset=utf-8',
};
const CustomerHeader = {
    'Content-Type': 'application/json; charset=utf-8',
};
let content, order, stander_id, products;



await post('/auth/sign-up', {
    username: 'ts1',
    password: 'test',
    email: 'ts1@gmail.com',
    role: Role.Stander,
}, StanderHeader);

await post('/auth/sign-up', {
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



stander_id = await get('/account', {}, StanderHeader);

await get('/account/user', {}, CustomerHeader);

await post('/account/user', {
    email: 'newemail@mail.com'
}, CustomerHeader);

await get('/account/user', {}, CustomerHeader);



await get('/account/profile', {}, CustomerHeader);

await post('/account/profile', {
    name: 'test customer 1',
    phone: '01012345678',
    image: 'https://cdn.britannica.com/68/178268-050-5B4E7FB6/Tom-Cruise-2013.jpg'
}, CustomerHeader);

await get('/account/profile', {}, CustomerHeader);



products = await get('/browse/product');

await get(`/browse/product/${products[0]._id}`);

await get(`/browse/product/${products[1]._id}`);



await get('/customer/cart', {}, CustomerHeader);

await post('/customer/cart', {
    product: products[0]._id,
    quantity: 1,
}, CustomerHeader);

await post('/customer/cart', {
    product: products[1]._id,
    quantity: 3,
}, CustomerHeader);

await get('/customer/cart', {}, CustomerHeader);



content = await get('/browse/stander');

await get(`/browse/stander/${content[0]._id}`);

await get('/stander/order', {}, StanderHeader);


// ใช้ /customer/order/from-cart ดีกว่า
order = await post('/customer/order', {
    stander: stander_id,
    task: {
        kind: TaskType.Shopping,
        items: [
            { product: products[0]._id, quantity: 5 },
        ],
    },
}, CustomerHeader);

// ดู orders ทั้งหมดของ stander
await get('/stander/order', {}, StanderHeader);

// ดู orders ทั้งหมดของ customer
await get('/customer/order', {}, CustomerHeader);

// stander รับ order
await post(`/stander/order/${order._id}/accept`, {}, StanderHeader);

// แค่เช็คดู status ของ order
await get('/customer/order', {}, CustomerHeader);

// ส่งจ่ายเงิน
await post(`/customer/order/${order._id}/pay`, {}, CustomerHeader);

// เช็ค status ของ order ใหม่
await get('/customer/order', {}, CustomerHeader);


// อัพเดต status ต่อไป
await post(`/stander/order/${order._id}`, {}, StanderHeader);
await post(`/stander/order/${order._id}`, {}, StanderHeader);
await post(`/stander/order/${order._id}`, {}, StanderHeader);

// อัพเดต status แบบเลือก
await post(`/stander/order/${order._id}`, {
    status: TrackStatus.Delivered,
}, StanderHeader);


// เขียน รีวิว
await post(`/customer/order/${order._id}/review`, {
    rating: 5,
    comment: 'good'
}, CustomerHeader);

await get('/customer/order', {}, CustomerHeader);


// สร้าง queueing order
order = await post('/customer/order', {
    stander: stander_id,
    task: {
        kind: TaskType.Queueing,
        location: {
            province: 'Bangkok',
            district: 'Pathum Wan',
            subdistrict: 'Wang Mai',
            detail: 'อุโมงลับใต้ดิน หลังสวน 100',
        },
        datetime: Date.now() + 60000,
        size: PackageSize.Medium,
        detail: 'วัตถุระเบิด C4',
    },
}, CustomerHeader)


// แบบ group shopping
order = await post('/customer/order', {
    stander: stander_id,
    task: {
        kind: TaskType.GroupShopping,
        items: [
            { product: products[1]._id, quantity: 3 },
        ],
    },
}, CustomerHeader);


// shopping order จากตระกร้า
order = await post('/customer/order/from-cart', {
    stander: stander_id,
    kind: TaskType.Shopping,
}, CustomerHeader);



process.exit(0);