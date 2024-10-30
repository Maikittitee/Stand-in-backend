import { Router } from 'express';

import { Order, OrderStatus } from '../../model/Order.js';
import { TaskType } from '../../model/Task.js';


export default Router()
    .get('/', async (req: CustomerRequest, res) => {
        const customer = req.auth!.account;
        const history = await customer.getHistory();

        res.json(history);
    })

    .post('/', async (req: CustomerRequest, res) => {
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

    .get('/:id', async (req: CustomerRequest, res) => {
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

    .post('/:id/review', async (req: CustomerRequest, res) => {
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

    .post('/:id/pay', async (req: CustomerRequest, res) => {
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

    .post('/:id/cancel', async (req: CustomerRequest, res) => {
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

    .post('/:id/stander', async (req: CustomerRequest, res) => {
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

    .post('/from-cart', async (req: CustomerRequest, res) => {
        const customer = req.auth!.account;
        const kind: TaskType.Shopping | TaskType.GroupShopping = req.body.kind;

        if (customer.cart.length === 0) {
            res.status(404).end();
            return;
        }

        try {
            var order = await Order.create({
                customer: customer._id,
                stander: req.body.stander,
                task: {
                    kind: kind,
                    items: customer.cart,
                }
            });
        }
        catch (error) {
            res.status(400).json({ error });
            return;
        }

        customer.cart.splice(0, customer.cart.length);

        res.json(order);
    })