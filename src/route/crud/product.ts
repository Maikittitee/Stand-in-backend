import { Router } from 'express';
import { Brand, Product, ProductModel } from '../../model/Product.js';

export default Router()


.post('/brand', async (req, res, next) => {
    let brand;
    try {
        brand = await Brand.create(req.body);
    }
    catch (error) {
        res.status(400);
        return;
    }

    res.json(brand);
})
.get('/brand/:id', async (req, res, next) => {
    const { id } = req.params;
    const brand = await Brand.findById(id);

    if (brand === null) {
        res.status(404);
        return;
    }

    res.json(brand);
})
.put('/brand/:id', async (req, res, next) => {
    const { id } = req.params;
    const brand = await Brand.findByIdAndUpdate(id, req.body);

    if (brand === null) {
        res.status(404);
        return;
    }

    res.json(brand);
})
.delete('/brand/:id', async (req, res, next) => {
    const { id } = req.params;
    const brand = await Brand.findByIdAndDelete(id);

    if (brand === null) {
        res.status(404);
        return;
    }

    res.status(204);
})


.post('/model', async (req, res, next) => {
    let model;
    try {
        model = await ProductModel.create(req.body);
    }
    catch (error) {
        res.status(400);
        return;
    }

    res.json(model);
})
.get('/model/:id', async (req, res, next) => {
    const { id } = req.params;
    const model = await ProductModel.findById(id);

    if (model === null) {
        res.status(404);
        return;
    }

    res.json(model);
})
.put('/model/:id', async (req, res, next) => {
    const { id } = req.params;
    const model = await ProductModel.findByIdAndUpdate(id, req.body);

    if (model === null) {
        res.status(404);
        return;
    }

    res.json(model);
})
.delete('/model/:id', async (req, res, next) => {
    const { id } = req.params;
    const model = await ProductModel.findByIdAndDelete(id);

    if (model === null) {
        res.status(404);
        return;
    }

    res.status(204);
})


.post('/shoppingProduct', async (req, res, next) => {
    let product;
    try {
        product = await Product.create(req.body);
    }
    catch (error) {
        res.status(400);
        return;
    }

    res.json(product);
})
.get('/shoppingProduct/:id', async (req, res, next) => {
    const { id } = req.params;
    const product = await Product
        .findById(id)
        .populate({
            path: 'store',
            populate: 'building',
        })
        .populate({
            path: 'variant',
            populate: {
                path: 'product_model',
                populate: 'brand',
            }
        });

    if (product === null) {
        res.status(404);
        return;
    }

    res.json(product);
})
.put('/shoppingProduct/:id', async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body);

    if (product === null) {
        res.status(404);
        return;
    }

    res.json(product);
})
.delete('/shoppingProduct/:id', async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (product === null) {
        res.status(404);
        return;
    }

    res.status(204);
})