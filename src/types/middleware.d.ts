import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose'
import { JwtPayload } from 'jsonwebtoken';
import { Request as JwtRequest } from 'express-jwt';


declare global {
    type middleware = (req: Request, res: Response, next: NextFunction) => void;

    type AuthRequest<U> = JwtRequest<{ account: U, account_id: Types.ObjectId}>;
    type StanderRequest = AuthRequest<TStander>;
    type CustomerRequest = AuthRequest<TCustomer>;
    type AccountRequest = AuthRequest<TAccount>;
}
