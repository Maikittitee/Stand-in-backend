import { Router } from 'express';
import { Store, Building } from '../../model/Address.js';

export default Router()


.post('/store', async (req, res, next) => {
    let store;
    try {
        store = await Store.create(req.body);
    }
    catch (error) {
        res.status(400);
        return;
    }

    res.json(store);
})
.get('/store/:id', async (req, res, next) => {
    const { id } = req.params;
    const store = await Store.findById(id);

    if (store === null) {
        res.status(404);
        return;
    }

    res.json(store);
})
.put('/store/:id', async (req, res, next) => {
    const { id } = req.params;
    const store = await Store.findByIdAndUpdate(id, req.body);

    if (store === null) {
        res.status(404);
        return;
    }

    res.json(store);
})
.delete('/store/:id', async (req, res, next) => {
    const { id } = req.params;
    const store = await Store.findByIdAndDelete(id);

    if (store === null) {
        res.status(404);
        return;
    }

    res.status(204);
})


.post('/building', async (req, res, next) => {
    let building;
    try {
        building = await Building.create(req.body);
    }
    catch (error) {
        res.status(400);
        return;
    }

    res.json(building);
})
.get('/building/:id', async (req, res, next) => {
    const { id } = req.params;
    const building = await Building.findById(id);

    if (building === null) {
        res.status(404);
        return;
    }

    res.json(building);
})
.put('/building/:id', async (req, res, next) => {
    const { id } = req.params;
    const building = await Building.findByIdAndUpdate(id, req.body);

    if (building === null) {
        res.status(404);
        return;
    }

    res.json(building);
})
.delete('/building/:id', async (req, res, next) => {
    const { id } = req.params;
    const building = await Building.findByIdAndDelete(id);

    if (building === null) {
        res.status(404);
        return;
    }

    res.status(204);
})