import express from 'express';
import authRoutes from './routes/auth';
import dialectsRoutes from './routes/dialects';
import questsRoutes from './routes/quests';
import usersRoutes from './routes/users';

// アプリケーションの設定
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.API_PORT || 8080;

// 認証ルーティング
app.use('/auth', authRoutes);

// 方言ルーティング
app.use('/dialects', dialectsRoutes);

// クエストルーティング
app.use('/quests', questsRoutes);

// ユーザールーティング
app.use('/users', usersRoutes);


app.listen(3000, () => {
  console.log(`Server is running on ${PORT} `);
});
