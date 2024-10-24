import { Router } from 'express';
import { validate_jwt, validate_account } from '../middleware/auth.js';

import { Order, OrderStatus } from '../model/Order.js';
import { TaskType } from '../model/Task.js';
import { Role } from '../model/Account.js';


export default Router()
    .use(validate_jwt)
    .use(validate_account(Role.Customer))


.get('/history', async (req: CustomerRequest, res) => {
    const customer = req.auth!.user;
    const history = await customer.getHistory();

    res.json(history);
})

.get('/cart', async (req: CustomerRequest, res) => {
    const customer = req.auth!.user;
    const customerPop = await customer.populate('cart.product');

    res.json(customerPop.cart);
})

.post('/cart', async (req: CustomerRequest, res) => {
    const customer = req.auth!.user;

    customer.cart.push(req.body);
    customer.save();

    res.json(customer.cart);
})

.post('/order/:id/review', async (req: CustomerRequest, res) => {
    const customer = req.auth!.user;
    const order = await Order.findById(req.params.id);

    if (order === null) {
        res.status(404);
        return;
    }
    if (order.customer !== customer._id) {
        res.status(403);
        return;
    }
    if (order.orderStatus.at(-1)!.status !== OrderStatus.Completed) {
        res.status(400);
        return;
    }

    order.review = req.body;
    order.save();

    res.json(order.review);
})

.get('/order/:id/pay', async (req: CustomerRequest, res) => {
    const customer = req.auth!.user;
    const order = await Order.findById(req.params.id);

    if (order === null) {
        res.status(404);
        return;
    }
    if (order.customer !== customer._id) {
        res.status(403);
        return;
    }
    if (order.orderStatus.at(-1)!.status !== OrderStatus.Accepted) {
        res.status(400);
        return;
    }

    order.orderStatus.push({ status: OrderStatus.Paid });
    order.save();

    res.json(order.orderStatus);
})

.post('/order/:id/cancel', async (req: CustomerRequest, res) => {
    const customer = req.auth!.user;
    const order = await Order.findById(req.params.id);

    if (order === null) {
        res.status(404);
        return;
    }
    if (order.customer !== customer._id) {
        res.status(403);
        return;
    }
    if (order.orderStatus.at(-1)!.status >= OrderStatus.Paid) {
        res.status(400);
        return;
    }

    order.orderStatus.push({ status: OrderStatus.Cancelled });
    order.save();

    res.json(order.orderStatus);
})

.post('/order/:id/stander', async (req: CustomerRequest, res) => {
    const customer = req.auth!.user;
    const { stander } = req.body;
    const order = await Order.findById(req.params.id);

    if (order === null) {
        res.status(404);
        return;
    }
    if (order.customer !== customer._id) {
        res.status(403);
        return;
    }
    if (order.orderStatus.at(-1)!.status !== OrderStatus.Rejected) {
        res.status(400);
        return;
    }

    order.orderStatus.push({ status: OrderStatus.Pending });
    order.stander = stander;
    order.save();

    res.json(order.orderStatus);
})

.post('/order', async (req: CustomerRequest, res) => {
    const customer = req.auth!.user;
    const { stander, task } = req.body;
    let order;

    try {
        order = await Order.create({
            customer: customer._id,
            stander: stander,
            task: task,
        });
    }
    catch (error) {
        res.status(400);
        return;
    }

    res.json(order);
})