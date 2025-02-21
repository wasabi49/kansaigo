import { Request, Response, NextFunction } from 'express';
import { getDb } from '../db';

interface LoginAttempt {
  ip: string;
  mail_address: string | null;
  attempts: number;
  last_attempt: number;
}

export const attempts = new Map<string, LoginAttempt>();
const MAX_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15分

export async function loginRateLimiter(req: Request, res: Response, next: NextFunction): Promise<void> {
  const ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'unknown';
  const { mail_address } = req.body;
  const db = await getDb();
  const now = Date.now();

  // IPとメールアドレスの両方で試行回数をチェック
  const [ipAttempt, mailAttempt] = await Promise.all([
    db.get('SELECT * FROM login_attempts WHERE ip = ?', [ip]),
    mail_address ? db.get('SELECT COUNT(*) as total FROM login_attempts WHERE mail_address = ?', [mail_address]) : null
  ]);

  // メールアドレスの総試行回数をチェック
  if (mailAttempt && mailAttempt.total >= MAX_ATTEMPTS * 3) {  // IPより緩い制限
    res.status(429).json({
      message: 'This account is temporarily locked. Please try again later.'
    });
  }

  // 試行記録を取得または作成
  let attempt = await db.get(
    'SELECT * FROM login_attempts WHERE ip = ?',
    [ip]
  );

  if (!attempt) {
    await db.run(
      'INSERT INTO login_attempts (ip, attempts, last_attempt) VALUES (?, ?, ?)',
      [ip, 0, now]
    );
    attempt = { ip, attempts: 0, last_attempt: now };
  }

  // ロック時間が経過していたらリセット
  if (now - attempt.last_attempt > LOCK_TIME) {
    await db.run(
      'UPDATE login_attempts SET attempts = 0, last_attempt = ? WHERE ip = ?',
      [now, ip]
    );
    attempt.attempts = 0;
  }

  // 最大試行回数を超えている場合
  if (attempt.attempts >= MAX_ATTEMPTS) {
    const timeLeft = LOCK_TIME - (now - attempt.last_attempt);
    res.status(429).json({
      message: `Too many login attempts. Please try again in ${Math.ceil(timeLeft / 60000)} minutes`
    });
  }

  // 試行回数を増やす
  await db.run(
    'UPDATE login_attempts SET attempts = attempts + 1, last_attempt = ? WHERE ip = ?',
    [now, ip]
  );

  next();
}

// ログイン成功時のリセット関数
export async function resetLoginAttempts(ip: string): Promise<void> {
  const db = await getDb();
  await db.run(
    'DELETE FROM login_attempts WHERE ip = ?',
    [ip]
  );
}