import express, { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';

const router = express.Router();

// 認証
router.post('/login', (req: Request, res: Response) => {
  res.send('Hello World');
});

// 認証確認
router.get('/verify', (req: Request, res: Response) => {
  res.send('auth/verify');
});

export default router;