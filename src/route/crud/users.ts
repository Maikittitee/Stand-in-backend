import express, { Request, Response, NextFunction } from "express";
import { User } from "../../model/User.js"; // Assuming User is already typed in User.ts

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const users = await User.find();
		res.json(users);
	} catch (err) {
		next(err);
	}
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await User.findById(req.params.id);
		res.json(user);
	} catch (err) {
		next(err);
	}
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await User.create(req.body);
		res.json(user);
	} catch (err) {
		next(err);
	}
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await User.findByIdAndUpdate(req.params.id, req.body);
		res.json(user);
	} catch (err) {
		next(err);
	}
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);
		res.json(user);
	} catch (err) {
		next(err);
	}
});

export default router;