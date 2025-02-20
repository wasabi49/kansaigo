// ユーザー認証情報を含むユーザー型
export interface User {
  // usersテーブルのカラム
  id: number;
  name: string;
  mail_address: string;
  current_streak: number;
  current_break: number;

  // user_authenticationsテーブルのカラム
  avatar_url: string | null;
}

// データベースから取得される認証情報を含むユーザー型
export interface UserAuth extends User {
  user_id: number;
  provider_id?: number;
  sub?: string;
  password_hash?: string;
}

// Express.Userインターフェースの拡張
declare global {
  namespace Express {
    interface User extends UserAuth {}
  }
}


