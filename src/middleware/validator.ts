import { Request, NextFunction, Response } from 'express';


// discard empty string Query params
export function convertQuery(req: Request, res: Response, next: NextFunction) {
    for (const [key, value] of Object.entries(req.query)) {
        if (value === '') {
            delete req.query[key];
        }
    }
    next();
}