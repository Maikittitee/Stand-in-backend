import { Router } from 'express';
import { Product } from '../../model/Product.js';


export default Router()
    .get('/', async (req: CustomerRequest, res) => {
        const customer = req.auth!.account;
        const pop = await customer.populate({
            path: 'cart.product',
            populate: [
                {
                    path: 'store',
                    populate: 'building',
                },
                {
                    path: 'variant',
                    populate: 'product_model'
                }
            ],
        });

        res.json(pop.cart);
    })

    .post('/', async (req: CustomerRequest, res) => {
        const customer = req.auth!.account;
        const last = customer.cart.at(-1);

        if (last !== undefined) {
            const last_product = await Product.findById(last.product);
            const product = await Product.findById(req.body.product);

            if (!last_product!.store.equals(product!.store)) {
                res.status(400);
                return;
            }
        }
        customer.cart.push(req.body);
        customer.save();

        res.json(customer.cart);
    })

    .delete('/', async (req: CustomerRequest, res) => {
        const customer = req.auth!.account;

        customer.cart.splice(0, customer.cart.length);
        customer.save();

        res.json(customer.cart);
    })

    .delete('/:id', async (req: CustomerRequest, res) => {
        const customer = req.auth!.account;
        customer.cart.pull(req.params.id);

        res.json(customer.cart);
    })