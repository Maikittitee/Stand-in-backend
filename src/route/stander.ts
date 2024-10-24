import { Router } from 'express';
import { validate_jwt, validate_account } from '../middleware/auth.js';

import { Order, OrderStatus, TrackStatus } from '../model/Order.js';
import { TaskType } from '../model/Task.js';
import { Role } from '../model/Account.js';


export default Router()
    .use(validate_jwt)
    .use(validate_account(Role.Stander))


.get('/history', async (req: StanderRequest, res) => {
    const stander = req.auth!.user;
    const orders = await Order.find({ stander: stander._id });

    res.json(orders);
})

.post('/order/:id/accept', async (req: StanderRequest, res) => {
    const stander = req.auth!.user;
    const order = await Order.findById(req.params.id);

    if (order == null) {
        res.status(404);
        return;
    }
    if (order.stander != stander._id) {
        res.status(401);
        return;
    }
    if (order.orderStatus.at(-1)!.status != OrderStatus.Pending) {
        res.status(400);
        return;
    }

    order.orderStatus.push({ status: OrderStatus.Accepted });
    order.save();

    res.json(order.orderStatus);
})

.post('/order/:id/reject', async (req: StanderRequest, res) => {
    const stander = req.auth!.user;
    const order = await Order.findById(req.params.id);

    if (order == null) {
        res.status(404);
        return;
    }
    if (order.stander != stander._id) {
        res.status(401);
        return;
    }
    if (order.orderStatus.at(-1)!.status != OrderStatus.Pending) {
        res.status(400);
        return;
    }

    order.orderStatus.push({ status: OrderStatus.Rejected });
    order.save();

    res.json(order.orderStatus);
})

.post('/order/:id/status', async (req: StanderRequest, res) => {
    const stander = req.auth!.user;
    const order = await Order.findById(req.params.id);

    if (order == null) {
        res.status(404);
        return;
    }
    if (order.stander != stander._id) {
        res.status(401);
        return;
    }

    let status: TrackStatus = req.body.status;

    if (status == undefined) {
        const currentStatus = order.trackStatus.at(-1)!.status;
        status = currentStatus + 1;
    }

    order.trackStatus.push({ status });
    order.save();

    res.json(order.trackStatus);
})