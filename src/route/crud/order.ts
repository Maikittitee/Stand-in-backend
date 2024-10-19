import { Router } from 'express';
import { Order } from '../../model/Order.js';

export default Router()


.post('/order', async (req, res, next) => {
    let order;
    try {
        order = await Order.create(req.body);
    }
    catch (error) {
        res.status(400);
        return;
    }

    res.json(order);
})
.get('/order/:id', async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (order == null) {
        res.status(404);
        return;
    }

    res.json(order);
})
.put('/order/:id', async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findById(id); // ...

    if (order == null) {
        res.status(404);
        return;
    }

    const { name } = req.body;
    await order.save();

    res.json(order);
})
.patch('/order/:id', async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findById(id); // ...

    if (order == null) {
        res.status(404);
        return;
    }

    res.json(order);
})
.delete('/order/:id', async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);

    if (order == null) {
        res.status(404);
        return;
    }

    res.status(204);
})