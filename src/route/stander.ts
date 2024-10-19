import { Router } from 'express';
import { Request } from "express-jwt";

import { validate_jwt, check_auth } from '../middleware/auth.js';
import { Order, OrderStatus } from '../model/Order.js';
import { TaskType } from '../model/Task.js';
import { TrackStatus } from '../model/Order.js';
// import { User } from '../model/test_user.js'

export default Router()

.use(validate_jwt)
.use(check_auth)

.get('/history', async (req: Request, res, next) => {
    const authHeader = req.headers["authorization"];

    // @ts-expect-error
    const stander_id = user_data['username'];
    const orders = await Order.find({ stander: stander_id });

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

.post('/order/:id/taking', async (req: Request, res, next) => {
    const { id } = req.params;
    const action: boolean = req.body.taking;
    // @ts-expect-error
    const stander_id = res.auth.user;

    const order = await Order.findById(id);

    if (order == null) {
        res.status(404);
        return;
    }
    else {
        if (order.stander != stander_id) {
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

.post('/order/:id/tracking', async (req: Request, res, next) => {
    const { id } = req.params;
    const status: TrackStatus = req.body.status;
    // @ts-expect-error
    const stander_id = res.auth.user;

    const order = await Order.findById(id);

    if (order == null) {
        res.status(404);
        return;
    }
    else {
        if (order.stander != stander_id) {
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