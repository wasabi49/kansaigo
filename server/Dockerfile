FROM node:latest

WORKDIR /app

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