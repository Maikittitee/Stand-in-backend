import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../model/User.js"; // Ensure User is correctly typed in User.ts
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';

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

		const token = jwt.sign({
			username: user_data.username,
			role: "user"
		}, "secret" , {expiresIn: "1h"} );
		res.json({
			message: "Login success",
			token
		});

	} catch (error) {
		console.error("error: ", error);
		res.status(401).json({
			message: "Login Failed"
		});
	}
});

router.get('/me', async (req: Request, res: Response) => {
	try {
		const authHeader: any = req.headers["authorization"];
		console.log(authHeader)
		let authToken = ''
		if (authHeader){
			authToken = authHeader.split(' ')[1];
		}
		const user_data: any = jwt.verify(authToken, 'secret');
		console.log(user_data);
		const LoginUser = await User.findOne({username: user_data['username']});
		res.json({
			"message": "successful",
			"data": LoginUser
		});
	} catch (error) {
		res.json({ "message": error });
	}
});

export default router;