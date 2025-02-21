import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { getDb } from '../db';
import { UserAuth } from '../types/User';

export const localStrategy = new LocalStrategy(
  {
    usernameField: 'mail_address',
    passwordField: 'password',
  },
  async (mail_address, password, done) => {
    try {
      const db = await getDb();
      const user = await db.get<UserAuth>(
        `SELECT
          u.id,
          u.name,
          c.mail_address,
          u.current_streak,
          u.current_break,
          c.password_hash
          FROM users u
          LEFT JOIN credentials c ON u.id = c.user_id
          WHERE c.mail_address = ?`,
        [mail_address]
      );
      console.log(user);

      if (!user) {
        done(null, false, { message: 'メールアドレスまたはパスワードが間違っています' });
      }else if(user.password_hash){
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        console.log(isPasswordValid);
        if (!isPasswordValid) {
          done(null, false, { message: 'メールアドレスまたはパスワードが間違っています' });
        }else{
          done(null, user);
        }
      }else{
        done(null, false, { message: 'メールアドレスまたはパスワードが間違っています' });
      }
    } catch (error) {
      console.error(error);
      done(error as Error, false, { message: 'server error' });
    }
  },
);


