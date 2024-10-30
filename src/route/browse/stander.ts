import { Router, Request, Response } from 'express';
import * as fuzz from 'fuzzball';

import { Stander } from '../../model/Stander.js';
import { PackageSize } from '../../model/Task.js';


async function view_stander(stander: TStander) {
    return {
        _id: stander._id,
        profile: stander.profile,
        score: await stander.getScore(),
    }
}


async function filter_stander(
    { name, location, product }: any,
    query: {} = {},
) {
    const filtered_standers = await Stander.find({
        // service: {
        //     location: location,
        //     products: { $eleMatch: product },
        // },
        ...query
    });

    const scores = await Promise.all(
        filtered_standers.map(async (stander) => {
            const score = await stander.getScore();

            if (score === undefined) {
                return { stander, score: 0 };
            }
            return { stander, score };
        }
    ));

    let standers = scores
        .sort((a, b) => b.score - a.score)
        .map(s => s.stander);

    if (name) {
        standers = fuzz.extract(name, standers, {
            scorer: fuzz.partial_ratio,
            processor: stander => stander.name,
            cutoff: 50,
        }).map(r => r[0]);
    }

    return await Promise.all(
        standers.map(view_stander)
    );
}


export default Router()
    .get('/', async (req, res) => {
        const stander = await filter_stander(req.query);

        res.json(stander);
    })

    .get('/:id', async (req, res) => {
        const stander = await Stander.findById(req.params.id);

        if (stander === null) {
            res.status(404);
            return;
        }

        res.json(view_stander(stander));
    })

    .get('/:id/review', async (req, res) => {
        const standers = await filter_stander(req.query);

        res.json(standers);
    })

    .get('/queueing', async (req, res) => {
        const size = req.query.size as PackageSize;

        const standers = await filter_stander(req.query, {
            'queueing.available': true,
            ['queueing.charge.' + size]: { $exists: true },
        });

        res.json(standers);
    })

    .get('/shopping', async (req, res) => {
        const standers = await filter_stander(req.query, {
            'shopping.available': true,
        });

        res.json(standers);
    })

    .get('/group-shopping', async (req, res) => {
        const { store, building } = req.query;

        const standers = await filter_stander(req.query, {
            'groupshopping.available': true,
            'groupshopping.building': building,
            'groupshopping.store': store,
        });

        res.json(standers);
    })