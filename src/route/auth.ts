import 'dotenv/config';
import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { User } from "../model/User.js";
import { Role } from "../model/Account.js";
import { Customer } from '../model/Customer.js';
import { Stander } from '../model/Stander.js';
import { Account } from '../model/Account.js';


interface SignUpRequestBody {
	username: string;
	password: string;
	email: string;
}

// @ts-ignore
const roleMap = new Map<Role, typeof Account>([
	[Role.Customer, Customer],
	[Role.Stander, Stander],
]);


const router = express.Router();

router.post('/sign-up', async (req: Request, res: Response) => {
	const { user: user_data, role } = req.body as { user: SignUpRequestBody, role: Role};
	const AccountModel = roleMap.get(role);

	if (AccountModel === undefined) {
		res.status(400);
		return;
	}

	try {
		const user = await User.create({
			username: user_data.username,
			password: await bcrypt.hash(user_data.password, 10),
			email: user_data.email,
		});

		const account = await AccountModel.create({ user: user._id });

		const token = jwt.sign(
			user._id,
			process.env.SECRET,
			{ expiresIn: "1h" }
		);

		res.json({ token });
	}
	catch (error) {
		res.status(400).json({ error });
	}
});

router.post('/sign-in', async (req: Request, res: Response) => {
	try {
		const { username, password } = req.body as { username: string; password: string };

		const user_data = await User.findOne({ username });
		if (user_data === null) {
			res.status(400).json({
				message: "Login Failed (user not found)"
			});
			return;
		}

		const match = await bcrypt.compare(password, user_data.password);
		if (!match) {
			res.status(400).json({
				message: "Login Failed (wrong username or password)"
			});
			return;
		}

		const token = jwt.sign(
			user_data._id,
			process.env.SECRET,
			{ expiresIn: "1h" }
		);

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


export default router;