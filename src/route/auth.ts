import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../model/User"; // Ensure User is correctly typed in User.ts
import { IUser } from "../types/user";
dotenv.config();

interface SignUpRequestBody {
	fullname: string;
	username: string;
	password: string;
	email: string;
  }

const router = express.Router();

router.post('/sign-up', async (req: Request, res: Response) => {
	try {
		const { fullname, username, password, email } = req.body;

		const password_hashed = await bcrypt.hash(password, 10);

		const user_data = {
			fullname,
			username,
			password: password_hashed,
			email,
		};

		const user = await User.create(user_data);
		res.json(user);

	} catch (error) {
		res.json({ error });
	}
});

router.post('/sign-in', async (req: Request, res: Response) => {
	try {
		const { username, password } = req.body as { username: string; password: string };

		const user_data: any = await User.findOne({ username });
		if (user_data == null) {
			res.status(400).json({
				message: "Login Failed (user not found)"
			});
			return;
		}

		console.log(user_data);
		const match = await bcrypt.compare(password, user_data.password);
		if (!match) {
			res.status(400).json({
				message: "Login Failed (wrong username or password)"
			});
			return;
		}

		res.json({
			message: "Login success",
		});
		
	} catch (error) {
		console.error("error: ", error);
		res.status(401).json({
			message: "Login Failed"
		});
	}
});

export default router;