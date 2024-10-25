import { Router } from 'express';
import { validate_jwt, validate_account } from '../middleware/auth.js';

import { Order, OrderStatus } from '../model/Order.js';
import { Role } from '../model/Account.js';


export default Router()
    .use(validate_jwt)
    .use(validate_account(Role.Customer))


.get('/cart', async (req: CustomerRequest, res) => {
    const customer = req.auth!.account;
    const pop = await customer.populate({
        path: 'cart.product',
        populate: [
            {
                path: 'store',
                populate: 'building',
            },
            {
                path: 'variant',
                populate: 'product_model'
            }
        ],
    });

    res.json(pop.cart);
})

.post('/cart', async (req: CustomerRequest, res) => {
    const customer = req.auth!.account;

    customer.cart.push(req.body);
    customer.save();

    res.json(customer.cart);
})

.delete('/cart', async (req: CustomerRequest, res) => {
    const customer = req.auth!.account;

    // ...
    // customer.cart.push(req.body);
    // customer.save();

    res.json(customer.cart);
})

.get('/order', async (req: CustomerRequest, res) => {
    const customer = req.auth!.account;
    const history = await customer.getHistory();

    res.json(history);
})

.post('/order', async (req: CustomerRequest, res) => {
    const customer = req.auth!.account;
    const { stander, task } = req.body;

    try {
        var order = await Order.create({
            customer: customer._id,
            stander: stander,
            task: task,
        });
    }
    catch (error) {
        res.status(400).json({ error });
        return;
    }

    res.json(order);
})

.get('/order/:id', async (req: CustomerRequest, res) => {
    const customer = req.auth!.account;
    const order = await Order.findById(req.params.id);

    if (order === null) {
        res.status(404).end();
        return;
    }
    if (!order.customer.equals(customer._id)) {
        res.status(403).end();
        return;
    }

    res.json(order);
})

.post('/order/:id/review', async (req: CustomerRequest, res) => {
    const customer = req.auth!.account;
    const order = await Order.findById(req.params.id);

    if (order === null) {
        res.status(404).end();
        return;
    }
    if (!order.customer.equals(customer._id)) {
        res.status(403).end();
        return;
    }

    if (order.orderStatus.at(-1)!.status !== OrderStatus.Completed) {
        res.status(400).end();
        return;
    }

    order.review = req.body;
    order.save();

    res.json(order.review);
})

.post('/order/:id/pay', async (req: CustomerRequest, res) => {
    const customer = req.auth!.account;
    const order = await Order.findById(req.params.id);

    if (order === null) {
        res.status(404).end();
        return;
    }
    if (!order.customer.equals(customer._id)) {
        res.status(403).end();
        return;
    }

    if (order.orderStatus.at(-1)!.status !== OrderStatus.Accepted) {
        res.status(400).end();
        return;
    }

    order.orderStatus.push({ status: OrderStatus.Paid });
    order.save();

    res.json(order.orderStatus);
})

.post('/order/:id/cancel', async (req: CustomerRequest, res) => {
    const customer = req.auth!.account;
    const order = await Order.findById(req.params.id);

    if (order === null) {
        res.status(404).end();
        return;
    }
    if (!order.customer.equals(customer._id)) {
        res.status(403).end();
        return;
    }

    if (order.orderStatus.at(-1)!.status >= OrderStatus.Paid) {
        res.status(400).end();
        return;
    }

    order.orderStatus.push({ status: OrderStatus.Cancelled });
    order.save();

    res.json(order.orderStatus);
})

.post('/order/:id/stander', async (req: CustomerRequest, res) => {
    const customer = req.auth!.account;
    const { stander } = req.body;
    const order = await Order.findById(req.params.id);

    if (order === null) {
        res.status(404).end();
        return;
    }
    if (!order.customer.equals(customer._id)) {
        res.status(403).end();
        return;
    }

    if (order.orderStatus.at(-1)!.status !== OrderStatus.Rejected) {
        res.status(400).end();
        return;
    }

    order.orderStatus.push({ status: OrderStatus.Pending });
    order.stander = stander;
    order.save();

    res.json(order.orderStatus);
})