import express, { Request, Response } from 'express';

const router = express.Router();

// ユーザーの現在の継続期間
router.get('/:userId/stats/current-streak', (req: Request, res: Response) => {
  res.send('Hello World');
});

// ユーザーの現在の非継続期間
router.get('/:userId/stats/current-break', (req: Request, res: Response) => {
  res.send('Hello World');
});

// ユーザーのランク
router.get('/:userId/ranks', (req: Request, res: Response) => {
  res.send('Hello World');
});

export default router;