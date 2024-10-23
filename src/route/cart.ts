import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import ShoppingCartModel from "../model/ShoppingCart.js";

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const cart = await ShoppingCartModel.find();
		res.json(cart);
	} catch (err) {
		next(err);
	}
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const cart = await ShoppingCartModel.findById(req.params.id);
		res.json(cart);
	} catch (err) {
		next(err);
	}
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const cart = await ShoppingCartModel.create(req.body);
		res.json(cart);
	} catch (err) {
		next(err);
	}
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
	try {
		await ShoppingCartModel.findByIdAndUpdate(req.params.id, req.body);
		const cart = await ShoppingCartModel.findById(req.params.id); // Await added here
		res.json(cart);
	} catch (err) {
		next(err);
	}
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const cart = await ShoppingCartModel.findByIdAndDelete(req.params.id);
		res.json(cart);
	} catch (err) {
		next(err);
	}
});

export default router;