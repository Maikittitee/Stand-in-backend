import { Router } from 'express';
import * as fuzz from 'fuzzball';

import { Product, ProductModel, Brand } from '../model/Product.js';
import { Store, Building } from '../model/Address.js';
import { Stander } from '../model/Stander.js';

export default Router()


.get('/product', async (req, res, next) => {
    const {
        name,
        store_id,
        brand_id,
        category,
        price_start,
        price_end,
        // option, // color, size, etc.
    } = req.query;

    const filtered_models = await ProductModel.find({
        category: category,
        brand: brand_id,
        variant: {
            $elemMatch: {
                price: { $gte: price_start, $lte: price_end }
                // option: 'color'
            }
        },
    });
    console.log(filtered_models);

    const models_id = fuzz.extract(name, filtered_models, {
        scorer: fuzz.partial_ratio,
        processor: model => model.name,
        cutoff: 50,
    }).map(r => r[0]._id);
    console.log(models_id);

    const products = await Product.find({
        store: store_id,
        model: { $in: models_id },
    });

    res.json(products);
})

.get('/stander', async (req, res, next) => {
    const { name } = req.query;
    const all_stander = await Stander.find();

    const standers = fuzz.extract(name, all_stander, {
        scorer: fuzz.partial_ratio,
        processor: stander => stander.name,
        cutoff: 50,
    }).map(r => r[0]);

    res.json(standers);
})

.get('/store', async (req, res, next) => {
    const { name } = req.query;
    const all_store = await Store.find();

    const stores = fuzz.extract(name, all_store, {
        scorer: fuzz.partial_ratio,
        processor: store => store.name,
        cutoff: 50,
    }).map(r => r[0]);

    res.json(stores);
})

.get('/building', async (req, res, next) => {
    const { name } = req.query;
    const all_building = await Building.find({
        name: { $exists: true },
    });

    const buildings = fuzz.extract(name, all_building, {
        scorer: fuzz.partial_ratio,
        processor: building => building.name,
        cutoff: 50,
    }).map(r => r[0]);

    res.json(buildings);
})

.get('/brand', async (req, res, next) => {
    const { name } = req.query;
    const all_brand = await Brand.find();

    const brands = fuzz.extract(name, all_brand, {
        scorer: fuzz.partial_ratio,
        processor: brand => brand.name,
        cutoff: 50,
    }).map(r => r[0]);

    res.json(brands);
})

.get('/model', async (req, res, next) => {
    const { name } = req.query;
    const all_model = await ProductModel.find();

    const models = fuzz.extract(name, all_model, {
        scorer: fuzz.partial_ratio,
        processor: model => model.name,
        cutoff: 50,
    }).map(r => r[0]);

    res.json(models);
})