import { Request, Response, NextFunction } from "express";

declare global {
    type middleware = (req: Request, res: Response, next: NextFunction) => void;
    type AuthRequest = Request & { auth: { user: string } };
}