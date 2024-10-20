import { Router } from 'express';
import { validate_jwt, validate_account } from '../middleware/auth.js';

import { Order, OrderStatus, TrackStatus } from '../model/Order.js';
import { TaskType } from '../model/Task.js';
import { Role } from '../model/Account.js';


export default Router()
    .use(validate_account(Role.Stander))


.get('/profile', async (req: StanderRequest, res, next) => {
    const stander = req.auth!.user;
    const profile = await stander.populate(''); //?

    res.json(profile);
})


.get('/history', async (req: StanderRequest, res, next) => {
    const stander = req.auth!.user;
    const orders = await Order.find({ stander: stander._id });

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

.post('/order/:id/taking', async (req: StanderRequest, res, next) => {
    const stander = req.auth!.user;
    const { id } = req.params;
    const action: boolean = req.body.taking;

    const order = await Order.findById(id);

    if (order == null) {
        res.status(404);
        return;
    }
    else {
        if (order.stander != stander._id) {
            res.status(401);
            return;
        }
        if (order.status != OrderStatus.Pending) {
            res.status(400);
            return;
        }
    }

    if (action) {
        order.status = OrderStatus.Accepted;
    }
    else {
        order.status = OrderStatus.Rejected;
    }

    order.save();

    res.json(order.status);
})

.post('/order/:id/tracking', async (req: StanderRequest, res, next) => {
    const stander = req.auth!.user;
    const { id } = req.params;
    const status: TrackStatus = req.body.status;

    const order = await Order.findById(id);

    if (order == null) {
        res.status(404);
        return;
    }
    else {
        if (order.stander != stander._id) {
            res.status(401);
            return;
        }
    }

    order.trackStatus.push({
        datetime: new Date(),
        status: status,
    });
    order.save();

    res.json(order.trackStatus);
})