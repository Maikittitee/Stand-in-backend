import { Router } from 'express';
import { Order } from '../../model/Order.js';

export default Router()


.post('/order', async (req, res, next) => {
    let order;
    try {
        order = await Order.create(req.body);
    }
    catch (error) {
        res.status(400).end();
        return;
    }

    res.json(order);
})
.get('/order/:id', async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (order === null) {
        res.status(404).end();
        return;
    }

    res.json(order);
})
.put('/order/:id', async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findByIdAndUpdate(id, req.body);

    if (order === null) {
        res.status(404).end();
        return;
    }

    res.json(order);
})
.delete('/order/:id', async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);

    if (order === null) {
        res.status(404).end();
        return;
    }

    res.status(204);
})