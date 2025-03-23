FROM node:latest

WORKDIR /app

# 環境変数を設定
ENV NODE_ENV=$NODE_ENV
ENV FRONTEND_ORIGIN=$FRONTEND_ORIGIN
ENV FRONTEND_PORT=$FRONTEND_PORT
ENV BACKEND_PORT=$BACKEND_PORT
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
ENV GOOGLE_CALLBACK_URL=$GOOGLE_CALLBACK_URL
ENV SESSION_SECRET=$SESSION_SECRET
ENV FRONT_URL=$FRONT_URL

# 依存関係のインストールを最適化するためにpackage.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# ソースコードをコピー
COPY . .

# TypeScriptをビルド
RUN npm run build

# SQLiteデータベースのディレクトリを作成
RUN mkdir -p /app/database

# アプリケーションのポートを公開
EXPOSE 8080

# コンテナ起動時にシードデータを実行してからアプリケーションを起動
CMD sh -c "mkdir -p /app/database && echo 'データベースの初期化を実行中...' && npx ts-node src/scripts/seed.ts && echo 'アプリケーションを起動中...' && npm start"