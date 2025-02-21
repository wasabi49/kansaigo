// 必須環境変数の型定義
interface Config {
  google: {
    clientId: string;
    clientSecret: string;
    callbackUrl: string;
  };
  session: {
    secret: string;
  };
  frontend: {
    url: string;
  };
}

// 環境変数チェックと設定の取得
export function getConfig(): Config {
  const requiredEnvVars = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_CALLBACK_URL',
    'SESSION_SECRET',
    'FRONT_URL'
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Environment variable ${envVar} is not set`);
    }
  }

  return {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackUrl: process.env.GOOGLE_CALLBACK_URL!
    },
    session: {
      secret: process.env.SESSION_SECRET!
    },
    frontend: {
      url: process.env.FRONT_URL!
    }
  };
} 