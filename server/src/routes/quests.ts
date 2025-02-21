import express, { Request, Response } from 'express';
import { getDb } from '../db';

const router = express.Router();

type Quest = {
  id: number;
  sequence_number: number;
  type: number;
  question: string;
  choices?: {
    id: number,
    content: string
  }[];
  is_available: boolean;
}


// クエスト詳細
router.get('/:questId', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const questId = req.params.questId;
    const quest: Quest | undefined = await db.get<Quest | undefined>('SELECT * FROM quests WHERE id = ?', [questId]);
    if (quest === undefined) {
      console.error(`Quest not found: ${questId}`);
      res.status(404).json({ error: 'Quest not found' });
      return;
    }
    res.json(quest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch quest' });
  }
});

// クエスト回答
router.post('/:questId/answer', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const questId: number = parseInt(req.params.questId);
    const answer: string = req.body.answer;
    const result = await db.get<{ type: number }>(
      'SELECT type FROM quests WHERE id = ?',
      [questId]
    );

    if (!result) {
      console.error(`Quest type not found: ${questId}`);
      res.status(404).json({ error: 'Quest type not found' });
      return;
    }

    if (result.type === 1) {
      // 選択肢クエスト
      const answerId: number = parseInt(answer);
      const choices = await db.all<{ id: number, choice_id: number, content: string, is_correct: boolean }[]>(
        'SELECT id, choice_id, content, is_correct FROM choices WHERE quest_id = ?',
        [questId]
      );

      if (!choices) {
        console.error(`Choices not found: ${questId}`);
        res.status(404).json({ error: 'Choices not found' });
        return;
      }

      const choice = choices.find(choice => choice.choice_id === answerId);
      if (!choice) {
        console.error(`Choice not found: ${answerId}`);
        res.status(404).json({ error: 'Choice not found' });
        return;
      }

      const correctAnswer = await db.get<{ content: string }>(
        'SELECT content FROM choices WHERE quest_id = ? AND is_correct = 1',
        [questId]
      );

      if (!correctAnswer) {
        console.error(`Correct answer not found: ${questId}`);
        res.status(404).json({ error: 'Correct answer not found' });
        return;
      }

      res.json({
        is_correct: choice.is_correct,
        correct_answer: correctAnswer.content
      });
    } else if (result.type === 2) {
      // 難読地名クエスト
      const result: { content: string } | undefined = await db.get<{ content: string } | undefined>('SELECT id, content FROM answers WHERE quest_id = ?', [questId]);
      if (result === undefined) {
        console.error(`Correct answer not found: ${questId}`);
        res.status(404).json({ error: 'Correct answer not found' });
      }
      const correctAnswer: string | undefined = result?.content;

      if (answer === correctAnswer) {
        // 正解
        res.json({ is_correct: true, correct_answer: correctAnswer });
      } else {
        // 不正解
        res.json({ is_correct: false, correct_answer: correctAnswer });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to answer quest' });
  }
});

export default router;