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
    const result: { type: number } | undefined = await db.get<{ type: number } | undefined>('SELECT type FROM quests WHERE id = ?', [questId]);

    if (result === undefined) {
      console.error(`Quest type not found: ${questId}`);
      res.status(404).json({ error: 'Quest type not found' });
    }
    const questType: number | undefined = result?.type;

    if (questType === 1) {
      // 選択肢クエスト
      const answerId: number = parseInt(answer);
      const choices: { id: number, content: string, is_correct: boolean }[] | undefined = await db.all<{ id: number, content: string, is_correct: boolean }[]>('SELECT id, content, is_correct FROM choices WHERE quest_id = ?', [questId]);
      if (choices === undefined) {
        console.error(`Choices not found: ${questId}`);
        res.status(404).json({ error: 'Choices not found' });
      }
      const choice: { id: number, content: string, is_correct: boolean } | undefined = choices.find(choice => choice.id === answerId);
      if (choice === undefined) {
        console.error(`Choice not found: ${answerId}`);
        res.status(404).json({ error: 'Choice not found' });
      } else {
        if (choice.is_correct) {
          // 正解
          console.log(`Correct answer: ${choice.content}`);
          const correctAnswer: string | undefined = await db.get<string | undefined>('SELECT id, content  FROM choices WHERE id = ? AND is_correct = 1', [questId]);
          if (correctAnswer === undefined) {
            console.error(`Correct answer not found: ${questId}`);
            res.status(404).json({ error: 'Correct answer not found' });
          }
          res.json({ is_correct: true, correct_answer: correctAnswer });
        } else {
          // 不正解
          const correctAnswer: string | undefined = await db.get<string | undefined>('SELECT id, content  FROM choices WHERE id = ? AND is_correct = 1', [questId]);
          if (correctAnswer === undefined) {
            console.error(`Correct answer not found: ${questId}`);
            res.status(404).json({ error: 'Correct answer not found' });
          }
          console.log(`Incorrect answer: ${choice.content}`);
          res.json({ is_correct: false, correct_answer: correctAnswer });
        }
      }


    } else if (questType === 2) {
      // 難読地名クエスト
      const result: { content: string } | undefined = await db.get<{ content: string } | undefined>('SELECT id, content FROM answers WHERE quest_id = ?', [questId]);
      if (result === undefined) {
        console.error(`Correct answer not found: ${questId}`);
        res.status(404).json({ error: 'Correct answer not found' });
      } else {
        const correctAnswer = result.content;
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