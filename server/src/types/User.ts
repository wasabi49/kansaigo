// ユーザー基本情報
export interface User {
  id: number;
  name: string;
  mail_address: string;
  current_streak: number;
  current_break: number;
  created_at: string;
  profile_image_url?: string;  // Base64エンコードされた画像URL
  ranks: {                    // ユーザーの各方言のランク
    osaka?: string;
    kyoto?: string;
    kobe?: string;
  };
}

// データベースから取得される認証情報を含むユーザー型
export interface UserAuth extends User {
  // Google認証情報
  provider_id?: number;
  sub?: string;
  avatar_url?: string;      // Google認証から取得したアバター画像

  // ローカル認証情報
  password_hash?: string;
}

// Express.Userインターフェースの拡張
declare global {
  namespace Express {
    interface User extends UserAuth {}
  }
}


