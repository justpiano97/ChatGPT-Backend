import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verifyToken } from '../utils/jwt';

export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token)
    return next({
      status: StatusCodes.UNAUTHORIZED,
      message: 'No token provided',
    });

  try {
    const data = verifyToken(token.split(' ')[1]);
    res.locals.payload = data;
    return next();
  } catch {
    return next({ status: StatusCodes.UNAUTHORIZED, message: 'Unauthorized' });
  }
};