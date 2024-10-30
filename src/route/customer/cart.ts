import { Router } from 'express';


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

        customer.cart.push(req.body);
        customer.save();

        res.json(customer.cart);
    })

    .delete('/:id', async (req: CustomerRequest, res) => {
        const customer = req.auth!.account;
        customer.cart.pull(req.params.id);

        res.json(customer.cart);
    })