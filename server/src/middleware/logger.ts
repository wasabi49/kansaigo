import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  console.log(`[${new Date().toISOString()}] Request: ${req.method} ${req.originalUrl}`);
  next();
}

export function responseLogger(req: Request, res: Response, next: NextFunction) {

  // 元のjson関数を保存
  const oldJson = res.json;

  // jsonをオーバーライド
  res.json = function(body): Response {
    console.log(`[${new Date().toISOString()}] Response: ${res.statusCode} ${req.method} ${req.originalUrl}`);
    return oldJson.call(this, body);
  };

  next();
}