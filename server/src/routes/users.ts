import express, { Request, Response, Router } from 'express';
import { getDb } from '../db';

const router: Router = express.Router();

// ユーザーの現在の継続期間
router.get('/:userId/stats/current-streak', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const db = await getDb();
    const streak: {current_streak: number} | undefined = await db.get<{current_streak: number}>(
      'SELECT current_streak FROM users WHERE id = ?',
      userId
    );

    if (streak === undefined) {
      res.status(404).json({ error: 'user not found' });
    }

    res.json(streak);
  } catch (error) {
    console.error('Error getting streak:', error);
    res.status(500).json({ error: 'server error' });
  }
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