import { Router } from 'express';
import { validate_jwt, validate_account } from '../middleware/auth.js';

import { Order, OrderStatus } from '../model/Order.js';
import { TaskType } from '../model/Task.js';
import { Role } from '../model/Account.js';


export default Router()
    .use(validate_jwt)
    .use(validate_account(Role.Customer))

.get('/profile', async (req: CustomerRequest, res, next) => {
	const customer = req.auth!.user;
    const profile = await customer.populate(''); //?

    res.json(profile);
})

.get('/history', async (req: CustomerRequest, res, next) => {
    const customer = req.auth!.user;
    const orders = await Order.find({ customer: customer._id });

    const ordersPop = orders.map(async (order) => {
        if (order.task?.kind == TaskType.Shopping) {
            return await order.populate('store')
        }
        else {
            return order; //?
        }
    });

    res.json(ordersPop);
})

.get('/cart', async (req: CustomerRequest, res, next) => {
    const customer = req.auth!.user;
    // customer.cart.find()?.populate('product');

    const cartPop = customer.cart.map(async (item: any) => {
        return await item.populate('product');
    });

    res.json(cartPop);
})

.post('/cart', async (req: CustomerRequest, res, next) => {
    const customer = req.auth!.user;

    customer.cart.push(req.body);
    customer.save();

    res.json(customer.cart);
})

.post('/review', async (req: CustomerRequest, res, next) => {
    const customer = req.auth!.user;
    const { order_id } = req.query;

    const order = await Order.findById(order_id);

    if (order == null) {
        res.status(404);
        return;
    }

    if (order.customer != customer._id) {
        res.status(403);
        return;
    }

    order.review = req.body;
    order.save();

    res.json(order.review);
})

.get('/pay', async (req: CustomerRequest, res, next) => {
    const customer = req.auth!.user;
    const { order_id } = req.query;

    const order = await Order.findById(order_id);

    if (order == null) {
        res.status(404);
        return;
    }

    if (order.customer != customer._id) {
        res.status(403);
        return;
    }

    order.status = OrderStatus.Paid;
    order.save();

    res.json(order.status);
})