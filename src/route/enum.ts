import { Router } from 'express';

import { TrackStatus, OrderStatus } from '../model/Order.js';
import { TaskType, PackageSize } from '../model/Task.js';
import { Category } from '../model/Product.js';
import { Role } from '../model/Account.js';


export default Router()
    .get('/track-status', async (req, res) => {
        res.json(TrackStatus);
    })

    .get('/order-status', async (req, res) => {
        res.json(OrderStatus);
    })

    .get('/task-type', async (req, res) => {
        res.json(TaskType);
    })

    .get('/category', async (req, res) => {
        res.json(Category);
    })

    .get('/role', async (req, res) => {
        res.json(Role);
    })

    .get('/package-size', async (req, res) => {
        res.json(PackageSize);
    })