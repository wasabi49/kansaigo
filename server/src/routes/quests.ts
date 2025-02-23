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
  is_available?: boolean;
}


// クエスト詳細
router.get('/:questId', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const questId = req.params.questId;

    // クエストの基本情報を取得
    const quest: Quest | undefined = await db.get<Quest | undefined>(
      'SELECT * FROM quests WHERE id = ?',
      [questId]
    );

    if (quest === undefined) {
      console.error(`Quest not found: ${questId}`);
      res.status(404).json({ error: 'Quest not found' });
      return;
    }

    // タイプ1（選択肢問題）の場合は選択肢も取得
    if (quest.type === 1) {
      const choices = await db.all(
        'SELECT choice_id as id, content FROM choices WHERE quest_id = ?',
        [questId]
      );
      quest.choices = choices;
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
    const userId = req.user!.id;

    // クエストの存在確認
    const result = await db.get<{ type: number }>(
      'SELECT type FROM quests WHERE id = ?',
      [questId]
    );

    if (!result) {
      console.error(`Quest type not found: ${questId}`);
      res.status(404).json({ error: 'Quest type not found' });
      return;
    }

    // クエストが存在する場合のみスタミナチェック
    const user = await db.get(
      'SELECT stamina, last_stamina_update FROM users WHERE id = ?',
      [userId]
    );

    const currentStamina = calculateCurrentStamina(user.stamina, user.last_stamina_update);
    if (currentStamina < 1) {
      res.status(400).json({
        error: 'Not enough stamina',
        next_recovery: getNextRecoveryTime(currentStamina, user.last_stamina_update)
      });
      return;
    }

    let isCorrect = false;
    let correctAnswer = '';

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

      const correctAnswerResult = await db.get<{ content: string }>(
        'SELECT content FROM choices WHERE quest_id = ? AND is_correct = 1',
        [questId]
      );

      isCorrect = choice!.is_correct === 1;
      correctAnswer = correctAnswerResult!.content;

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
      correctAnswer = correctAnswerResult!.content;
    } else {
      // 未知の問題タイプ
      res.status(400).json({ error: 'Invalid quest type' });
      return;
    }

    if (isCorrect) {
      // XPの計算と更新
      const progress = await db.get(
        'SELECT completion_count FROM quest_progress WHERE user_id = ? AND quest_id = ?',
        [userId, questId]
      );

      let xpGain = 0;
      if (!progress || progress.completion_count === 0) {
        // 初回クリア: 20XP
        xpGain = 20;
        await db.run(
          'INSERT OR REPLACE INTO quest_progress (user_id, quest_id, completion_count) VALUES (?, ?, 1)',
          [userId, questId]
        );
      } else {
        // 2回目以降: 5XP
        xpGain = 5;
        await db.run(
          'UPDATE quest_progress SET completion_count = completion_count + 1 WHERE user_id = ? AND quest_id = ?',
          [userId, questId]
        );
      }

      // ユーザーのXPを更新
      await db.run(
        'UPDATE users SET xp = xp + ? WHERE id = ?',
        [xpGain, userId]
      );

      res.json({
        is_correct: true,
        correct_answer: correctAnswer,
        xp_gained: xpGain
      });
    } else {
      res.json({
        is_correct: false,
        correct_answer: correctAnswer
      });
    }

    // 不正解の場合のみスタミナを消費
    if (!isCorrect) {
      await db.run(
        'UPDATE users SET stamina = ?, last_stamina_update = CURRENT_TIMESTAMP WHERE id = ?',
        [currentStamina - 1, userId]
      );
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to answer quest' });
  }
});

export default router;