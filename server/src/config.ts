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
    origin: string;
    url: string;
    port: number;
  };
  backend: {
    port: number;
  };
  environment: string;
}

// 環境変数チェックと設定の取得
export function getConfig(): Config {
  const requiredEnvVars = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_CALLBACK_URL',
    'SESSION_SECRET',
    'FRONTEND_ORIGIN',
    'FRONTEND_URL',
    'FRONTEND_PORT',
    'BACKEND_PORT',
    'NODE_ENV'
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`環境変数 ${envVar} が設定されていません`);
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
      origin: process.env.FRONTEND_ORIGIN!,
      url: process.env.FRONTEND_URL!,
      port: parseInt(process.env.FRONTEND_PORT!, 10)
    },
    backend: {
      port: parseInt(process.env.BACKEND_PORT!, 10)
    },
    environment: process.env.NODE_ENV!
  };
} 