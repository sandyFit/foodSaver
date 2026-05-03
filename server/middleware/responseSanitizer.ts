import { Request, Response, NextFunction } from 'express';

export const sanitizeResponse = (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send;

    // Use 'any' to allow the override without signature conflicts
    res.send = function (body): any {
        if (typeof body === 'object' && body !== null) {
            const { password, __v, _id, user, ...sanitized } = body;

            // Map _id to id if it exists
            if (_id) (sanitized as any).id = _id;

            return originalSend.call(this, sanitized);
        }
        return originalSend.call(this, body);
    };
    next();
};
