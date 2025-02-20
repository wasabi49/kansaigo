import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { googleStrategy } from './auth/google';
import { UserAuth } from './types/User';
import authRoutes from './routes/auth';
import dialectsRoutes from './routes/dialects';
import questsRoutes from './routes/quests';
import usersRoutes from './routes/users';
import { requestLogger, responseLogger } from './logger';
import { getDb } from './db';
import { initializePassport } from './auth/passport';
import connectSqlite3 from 'connect-sqlite3';
import { getConfig } from './config';

const config = getConfig();

// アプリケーションの設定
const app = express();
app.use(cors({
  // origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SQLiteStore = connectSqlite3(session);

// セッション設定
app.use(session({
  store: new SQLiteStore({
    db: 'sessions.sqlite',
    dir: './database',
    table: 'sessions'
  }) as session.Store,
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24時間
  }
}));

// Passport初期化
app.use(passport.initialize());
app.use(passport.session());
initializePassport();

const PORT = process.env.BACKEND_PORT || 8080;

// リクエストログ出力
app.use(requestLogger);

// 認証ルーティング
app.use('/auth', authRoutes);

// 方言ルーティング
app.use('/dialects', dialectsRoutes);

// クエストルーティング
app.use('/quests', questsRoutes);

// ユーザールーティング
app.use('/users', usersRoutes);

// レスポンスログ出力
app.use(responseLogger);

app.listen(3000, () => {
  console.log(`Server is running on ${PORT} `);
});




