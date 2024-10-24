import { Router } from 'express';
import { validate_jwt, validate_account } from '../middleware/auth.js';

import { Order, OrderStatus, TrackStatus } from '../model/Order.js';
import { Role } from '../model/Account.js';


export default Router()
    .use(validate_jwt)
    .use(validate_account(Role.Stander))


.get('/history', async (req: StanderRequest, res) => {
    const stander = req.auth!.account;
    const history = await stander.getHistory();

    res.json(history);
})

.post('/order/:id/accept', async (req: StanderRequest, res) => {
    const stander = req.auth!.account;
    const order = await Order.findById(req.params.id);

    if (order === null) {
        res.status(404).end();
        return;
    }
    if (order.stander !== stander._id) {
        res.status(401).end();
        return;
    }
    if (order.orderStatus.at(-1)!.status !== OrderStatus.Pending) {
        res.status(400).end();
        return;
    }

    order.orderStatus.push({ status: OrderStatus.Accepted });
    order.save();

    res.json(order.orderStatus);
})

.post('/order/:id/reject', async (req: StanderRequest, res) => {
    const stander = req.auth!.account;
    const order = await Order.findById(req.params.id);

    if (order === null) {
        res.status(404).end();
        return;
    }
    if (order.stander !== stander._id) {
        res.status(401).end();
        return;
    }
    if (order.orderStatus.at(-1)!.status !== OrderStatus.Pending) {
        res.status(400).end();
        return;
    }

    order.orderStatus.push({ status: OrderStatus.Rejected });
    order.save();

    res.json(order.orderStatus);
})

.post('/order/:id/tracking', async (req: StanderRequest, res) => {
    const stander = req.auth!.account;
    const order = await Order.findById(req.params.id);

    if (order === null) {
        res.status(404).end();
        return;
    }
    if (order.stander !== stander._id) {
        res.status(401).end();
        return;
    }

    let status: TrackStatus = req.body.status;

    if (status === undefined) {
        const currentStatus = order.trackStatus.at(-1)!.status;
        status = currentStatus + 1;
    }

    if (status === TrackStatus.Delivered) {
        order.orderStatus.push({ status: OrderStatus.Completed });
    }

    order.trackStatus.push({ status });
    order.save();

    res.json(order.trackStatus);
})