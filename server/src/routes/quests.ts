import express, { Request, Response } from 'express';
import { getDb } from '../db';
import { calculateCurrentStamina, getNextRecoveryTime } from '../utils/stamina';

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

    // クエストの存在確認
    const result = await db.get<{ type: number }>(
      'SELECT type FROM quests WHERE id = ?',
      [questId]
    );

    if (!result) {
      console.error(`Quest type not found: ${questId}`);
      res.status(404).json({ error: 'Quest type not found' });
    } else {
      // クエストが存在する場合のみスタミナチェック
      const user = await db.get(
        'SELECT stamina, last_stamina_update FROM users WHERE id = ?',
        [req.user!.id]
      );

      const currentStamina = calculateCurrentStamina(user.stamina, user.last_stamina_update);
      if (currentStamina < 1) {
        res.status(400).json({
          error: 'Not enough stamina',
          next_recovery: getNextRecoveryTime(currentStamina, user.last_stamina_update)
        });
      } else {
        let isCorrect = false;

        if (result.type === 1) {
          // 選択肢クエスト
          const answerId: number = parseInt(answer);
          const choice = await db.get<{ is_correct: number, content: string }>(
            'SELECT is_correct, content FROM choices WHERE quest_id = ? AND choice_id = ?',
            [questId, answerId]
          );

          if (!choice) {
            res.status(404).json({ error: 'Choice not found' });
            return;
          }

          const correctAnswer = await db.get<{ content: string }>(
            'SELECT content FROM choices WHERE quest_id = ? AND is_correct = 1',
            [questId]
          );

          isCorrect = choice!.is_correct === 1;

          res.json({
            is_correct: isCorrect,
            correct_answer: correctAnswer!.content
          });

        } else if (result.type === 2) {
          // 難読地名クエスト
          const correctAnswerResult = await db.get<{ content: string }>(
            'SELECT content FROM answers WHERE quest_id = ?',
            [questId]
          );

          if (!correctAnswerResult) {
            res.status(404).json({ error: 'Correct answer not found' });
            return;
          }

          isCorrect = answer === correctAnswerResult!.content;

          res.json({
            is_correct: isCorrect,
            correct_answer: correctAnswerResult!.content
          });
        }

        // 不正解の場合のみスタミナを消費
        if (!isCorrect) {
          await db.run(
            'UPDATE users SET stamina = ?, last_stamina_update = CURRENT_TIMESTAMP WHERE id = ?',
            [currentStamina - 1, req.user!.id]
          );
        }
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to answer quest' });
  }
});

export default router;