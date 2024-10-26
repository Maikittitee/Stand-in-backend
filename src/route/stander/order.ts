import { Router } from 'express';
import { Order, OrderStatus, TrackStatus } from '../../model/Order.js';


export default Router()
    .get('/', async (req: StanderRequest, res) => {
        const stander = req.auth!.account;
        const history = await stander.getHistory();

        const filtered = history.filter(
            order => order.orderStatus.at(-1)!.status !== OrderStatus.Rejected
        );

        res.json(filtered);
    })

    .get('/:id', async (req: StanderRequest, res) => {
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

    .post('/:id', async (req: StanderRequest, res) => {
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

    .post('/:id/accept', async (req: StanderRequest, res) => {
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

    .post('/:id/reject', async (req: StanderRequest, res) => {
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