import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import dialectsRoutes from './routes/dialects';
import questsRoutes from './routes/quests';
import usersRoutes from './routes/users';
import { requestLogger, responseLogger } from './logger';
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




