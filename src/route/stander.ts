import { Router } from 'express';
import { validate_jwt, validate_account } from '../middleware/auth.js';

import { Order, OrderStatus, TrackStatus } from '../model/Order.js';
import { Role } from '../model/Account.js';


export default Router()
    .use(validate_jwt)
    .use(validate_account(Role.Stander))


.get('/queueing', async (req: StanderRequest, res) => {
    const stander = req.auth!.account;

    // ...
    res.json();
})

.get('/shopping', async (req: StanderRequest, res) => {
    const stander = req.auth!.account;

    // ...
    res.json();
})

.get('/order', async (req: StanderRequest, res) => {
    const stander = req.auth!.account;
    const history = await stander.getHistory();

    res.json(history);
})

.get('/order/:id', async (req: StanderRequest, res) => {
    const stander = req.auth!.account;
    const order = await Order.findById(req.params.id);

    if (order === null) {
        res.status(404).end();
        return;
    }
    if (!order.stander.equals(stander._id)) {
        res.status(403).end();
        return;
    }

    res.json(order);
})

.post('/order/:id', async (req: StanderRequest, res) => {
    const stander = req.auth!.account;
    const order = await Order.findById(req.params.id);

    if (order === null) {
        res.status(404).end();
        return;
    }
    if (!order.stander.equals(stander._id)) {
        res.status(403).end();
        return;
    }

    let status: number | undefined = req.body.status;

    if (status !== undefined) {
        if (status === -1) {
            let currentStatus = order.trackStatus.at(-1)?.status;

            if (currentStatus === undefined) {
                currentStatus = TrackStatus.On_the_way;
            }
            else {
                status = currentStatus + 1;
            }
        }
        if (TrackStatus.On_the_way <= status || status <= TrackStatus.Delivered) {
            if (status === TrackStatus.Delivered) {
                if (order.orderStatus.at(-1)!.status !== OrderStatus.Completed) {
                    order.orderStatus.push({ status: OrderStatus.Completed });
                }
            }
            order.trackStatus.push({ status });
        }
    }

    try {
        order.save();
    }
    catch (error) {
        res.status(400).json({ error });
        return;
    }

    res.json(order);
})

.post('/order/:id/accept', async (req: StanderRequest, res) => {
    const stander = req.auth!.account;
    const order = await Order.findById(req.params.id);

    if (order === null) {
        res.status(404).end();
        return;
    }
    if (!order.stander.equals(stander._id)) {
        res.status(403).end();
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
    if (!order.stander.equals(stander._id)) {
        res.status(403).end();
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