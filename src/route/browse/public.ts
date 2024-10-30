import { Router } from 'express';
import * as fuzz from 'fuzzball';

import { ProductModel, Brand } from '../../model/Product.js';
import { Store, Building } from '../../model/Address.js';


export default Router()
    .get('/store', async (req, res) => {
        const { name } = req.query;
        const all_store = await Store.find();

        const stores = fuzz.extract(name, all_store, {
            scorer: fuzz.partial_ratio,
            processor: store => store.name,
            cutoff: 50,
        }).map(r => r[0]);

        res.json(stores);
    })

    .get('/building', async (req, res) => {
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

    .get('/brand', async (req, res) => {
        const { name } = req.query;
        const all_brand = await Brand.find();

        const brands = fuzz.extract(name, all_brand, {
            scorer: fuzz.partial_ratio,
            processor: brand => brand.name,
            cutoff: 50,
        }).map(r => r[0]);

        res.json(brands);
    })

    .get('/product-model', async (req, res) => {
        const { name } = req.query;
        const all_model = await ProductModel.find();

        const models = fuzz.extract(name, all_model, {
            scorer: fuzz.partial_ratio,
            processor: model => model.name,
            cutoff: 50,
        }).map(r => r[0]);

        res.json(models);
    })