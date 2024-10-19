import { Router } from 'express';
import { Request } from "express-jwt";

import { validate_jwt, check_auth } from '../middleware/auth.js';
import { Order, OrderStatus } from '../model/Order.js';
import { TaskType } from '../model/Task.js';
// import { Customer } from '../model/test_customer.js';


export default Router()

.use(validate_jwt)
.use(check_auth)

.get('/history', async (req: Request, res, next) => {
    const user_id = req.auth?.user; // customer_id ?
    const orders = await Order.find({ customer: user_id });

    const ordersPop = orders.map(async (order) => {
        if (order.task?.kind == TaskType.Shopping) {
            return await order.populate('store')
        }
        else {
            return order;
        }
    });

    res.json(ordersPop);
})

.get('/cart', async (req: Request, res, next) => {
    const user_id = req.auth?.user; // customer_id
    // @ts-expect-error
    const customer = await Customer.findById(user_id);

    if (customer == null) {
        res.status(404);
        return;
    }
    customer.cart.find({})?.populate('product');
    const cartPop = customer.cart.map(async (item: any) => {
        await item.populate('product')
        return;
    });

    res.json(cartPop);
})

.post('/cart', async (req: Request, res, next) => {
    const customer_id = req.auth?.user;
    // @ts-expect-error
    const customer = await Customer.findById(customer_id);

    if (customer == null) {
        res.status(404);
        return;
    }
    customer.cart.push(req.body);
    customer.save();

    res.json(customer.cart);
})

.post('/review', async (req: Request, res, next) => {
    const { order_id } = req.query;
    const customer_id = res.auth.user;

    const order = await Order.findById(order_id);

    if (order == null) {
        res.status(404);
        return;
    }

    if (order.customer != customer_id) {
        res.status(403);
        return;
    }

    order.review = req.body;
    order.save();

    res.json(order.review);
})

.get('/pay', async (req: Request, res, next) => {
    const { order_id } = req.query;
    const customer_id = res.auth?.user;
    const order = await Order.findById(order_id);

    if (order == null) {
        res.status(404);
        return;
    }

    if (order.customer != customer_id) {
        res.status(403);
        return;
    }

    order.status = OrderStatus.Paid;
    order.save();

    res.json(order.status);
})