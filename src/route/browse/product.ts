import { Router } from 'express';
import * as fuzz from 'fuzzball';
import { Product, ProductModel, ProductVariant } from '../../model/Product.js';;
import { ToNestedPath } from '../../service/index.js';


enum ProductSort {
    price,
    new,
    popularity,
}

const ProductSortMap = new Map<ProductSort, (a, b) => number>([
    [ProductSort.price, (a, b) => b.variant.price - a.variant.price],
    [ProductSort.new, (a, b) => b.createdAt - a.createdAt],
]);


export default Router()
    .get('/', async (req, res) => {
        const {
            name,
            store_id,
            brand_id,
            category,
            price_start,
            price_end,
            sortby,
            ...options // color, size, etc.
        } = req.query;

        let models = await ProductModel.find({
            brand: brand_id,
            category: category,
        });

        if (name) {
            models = fuzz
                .extract(name, models, {
                    scorer: fuzz.partial_ratio,
                    processor: model => model.name,
                    cutoff: 50,
                })
                .map(r => r[0]);
        }

        const variants = await ProductVariant.find({
            product_model: { $in: models.map(m => m._id) },
            price: { $gte: price_start || 0, $lte: price_end || Infinity },
            ...ToNestedPath(options)
        });

        let products = await Product
            .find({
                store: store_id,
                variant: { $in: variants.map(v => v._id) },
                available: true,
            })
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

        if (sortby !== undefined) {
            if ((sortby as string) in ProductSort) {
                res.status(400).end();
                return;
            }

            const func = ProductSortMap.get(Number(sortby))
            products = products.sort(func);
        }

        res.json(products);
    })

    .get('/:id', async (req, res) => {
        const product = await Product
            .findById(req.params.id)
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

        res.json(product);
    })