import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import authRoutes from './routes/auth';
import dialectsRoutes from './routes/dialects';
import questsRoutes from './routes/quests';
import usersRoutes from './routes/users';
import { requestLogger, responseLogger } from './middleware/logger';
import { initializePassport } from './auth/passport';
import connectSqlite3 from 'connect-sqlite3';
import { getConfig } from './config';
import { isAuthenticated } from './middleware/auth';
import { cleanupExpiredSessions } from './scripts/cleanupSessions';

const config = getConfig();

// アプリケーションの設定
const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
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

// レスポンスログ出力
app.use(responseLogger);



// 認証ルーティング
app.use('/auth', authRoutes);

// 保護されたルート
app.use('/dialects', isAuthenticated, dialectsRoutes);
app.use('/quests', isAuthenticated, questsRoutes);
app.use('/users', isAuthenticated, usersRoutes);



app.listen(3000, () => {
  console.log(`Server is running on ${PORT} `);
});

// 1時間ごとにクリーンアップを実行
setInterval(cleanupExpiredSessions, 60 * 60 * 1000);




