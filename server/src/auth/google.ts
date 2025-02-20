import { Profile, VerifyCallback, Strategy as GoogleStrategy, StrategyOptions } from 'passport-google-oauth20';
import { getDb } from '../db';
import { UserAuth } from '../types/User';
import { getConfig } from '../config';

const config = getConfig();
const googleStrategyOptions: StrategyOptions = {
  clientID: config.google.clientId,
  clientSecret: config.google.clientSecret,
  callbackURL: config.google.callbackUrl,
  scope: ['profile', 'email']
};

export const googleStrategy = new GoogleStrategy(
  googleStrategyOptions,
  async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
    try {
      const db = await getDb();
      const provider = await db.get('SELECT id FROM providers WHERE provider_name = ?', ['google']);
      if (!provider) {
        throw new Error('Provider not found');
      }

      let userAuth = await db.get<UserAuth>(
        'SELECT ua.*, u.* FROM user_authentications ua JOIN users u ON ua.user_id = u.id WHERE ua.provider_id = ? AND ua.sub = ?',
        [provider.id, profile._json.sub]
      );

      if (!userAuth) {
        await db.run('BEGIN TRANSACTION');
        try {
          const userResult = await db.run(
            'INSERT INTO users (name, mail_address) VALUES (?, ?)',
            [profile.displayName, profile.emails?.[0]?.value || '']
          );

          await db.run(
            'INSERT INTO user_authentications (user_id, provider_id, sub, avatar_url) VALUES (?, ?, ?, ?)',
            [userResult.lastID, provider.id, profile._json.sub, profile.photos?.[0]?.value || null]
          );

          userAuth = await db.get<UserAuth>(
            'SELECT ua.*, u.* FROM user_authentications ua JOIN users u ON ua.user_id = u.id WHERE ua.provider_id = ? AND ua.sub = ?',
            [provider.id, profile._json.sub]
          );

          await db.run('COMMIT');
        } catch (error) {
          await db.run('ROLLBACK');
          throw error;
        }
      }

      done(null, userAuth);
    } catch (error) {
      done(error as Error);
    }
  }
);