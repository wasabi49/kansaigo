import passport from 'passport';
import { getDb } from '../db';
import { UserAuth } from '../types/User';
import { googleStrategy } from './google';

// Passport設定の初期化
export function initializePassport() {
  // Google認証ストラテジーの設定
  passport.use(googleStrategy);

  // セッションにユーザー情報を保存
  passport.serializeUser((user: UserAuth, done) => {
    done(null, user.user_id);
  });

  // セッションからユーザー情報を復元
  passport.deserializeUser(async (id: number, done) => {
    try {
      const db = await getDb();
      const user = await db.get<UserAuth>(
        `SELECT
          u.id as id,
          u.name,
          u.mail_address,
          u.current_streak,
          u.current_break,
          ua.provider_id,
          ua.sub,
          ua.avatar_url
        FROM users u
        LEFT JOIN user_authentications ua ON u.id = ua.user_id
        WHERE u.id = ?`,
        [id]
      );
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}