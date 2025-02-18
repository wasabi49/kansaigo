import express, { Request, Response } from 'express';
import { getDb } from '../db';

const router = express.Router();

type Quest = {
  id: number;
  sequence_number: number;
  type: number;
  is_available: boolean;
  is_completed: boolean;
}

type Mode = {
  id: number;
  name: string;
}

// 方言一覧
router.get('/', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const dialectModes: Mode[] = await db.all('SELECT * FROM dialect_modes');
    res.json(dialectModes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch dialect modes' });
  }
});

// 方言のクエスト一覧
router.get('/:dialectId/quests', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const dialectId = req.params.dialectId;
    const sql: string = `
    SELECT 
      id, sequence_number, type 
    FROM 
      quests 
    WHERE 
      dialect_mode_id = ?`;
    const quests: Quest[] = await db.all<Quest[]>(sql, [dialectId]);
    res.json(quests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch quests' });
  }
});

export default router;