import passport from 'passport';
import { getDb } from '../db';
import { UserAuth } from '../types/User';
import { googleStrategy } from './google';
import { localStrategy } from './localStrategy';

// Passport設定の初期化
export function initializePassport() {
  // Google認証ストラテジーの設定
  passport.use(googleStrategy);

  // ローカル認証ストラテジーの設定
  passport.use('local', localStrategy);

  // セッションにユーザー情報を保存
  passport.serializeUser((user: UserAuth, done) => {
    done(null, user.id);
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
        LEFT JOIN credentials c ON u.id = c.user_id
        WHERE u.id = ?`,
        [id]
      );
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (error) {
      done(error);
    }
  });
}