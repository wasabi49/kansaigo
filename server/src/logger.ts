import { Request, Response, NextFunction } from 'express';

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

const responseLogger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${res.statusCode}`);
  next();
};

export { requestLogger, responseLogger };
