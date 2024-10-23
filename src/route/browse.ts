import { Router } from 'express';
import * as fuzz from 'fuzzball';

import { Product, ProductModel, ProductVariant, Brand } from '../model/Product.js';
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
        ...option // color, size, etc.
    } = req.query;

    const filterd_variants = await ProductVariant
        .find({
            price: { $gte: price_start, $lte: price_end },
            // option: option,
        })
        .populate('product_model')
        .find({
            product_model: {
                brand: brand_id,
                category: category,
            }
        });

    // @ts-expect-error
    const filtered_models: TModel[] = filterd_variants.map(variant => variant.product_model);
    console.log(filtered_models);

    const models_id = fuzz
        .extract(name, filtered_models, {
            scorer: fuzz.partial_ratio,
            processor: model => model.name,
            cutoff: 50,
        })
        .map(r => r[0]._id);
    console.log(models_id);

    const products = await Product
        .find({
            store: store_id,
            product_model: { $in: models_id },
            subproducts: {
                $elemMatch: {
                    variant: { $in: filterd_variants },
                    available: true,
                }
            }
        })
        .populate([
            {
                path: 'store',
                populate: 'building',
            },
            {
                path: 'product_model',
                populate: 'brand',
            },
            {
                path: 'subproducts',
                populate: 'variant',
            }
        ]);

    res.json(products);
})

.get('/stander', async (req, res, next) => {
    const { name, location, product } = req.query;

    const filterd_standers = await Stander.find({
        service: {
            location: location,
            product: product, //?
        }
    });

    const standers = fuzz.extract(name, filterd_standers, {
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

.get('/product_model', async (req, res, next) => {
    const { name } = req.query;
    const all_model = await ProductModel.find();

    const models = fuzz.extract(name, all_model, {
        scorer: fuzz.partial_ratio,
        processor: model => model.name,
        cutoff: 50,
    }).map(r => r[0]);

    res.json(models);
})