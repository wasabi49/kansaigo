# ========================================
# Step 1: Build Backend (Express + TypeScript)
# ========================================
FROM node:latest AS server-build

WORKDIR /app/server

# 必要なビルドツールをインストール
RUN apt-get update && apt-get install -y \
    sqlite3 \
    libsqlite3-dev

# package.json だけコピーして依存関係をインストール
COPY server/package*.json ./
RUN npm install

# バックエンドのソースコードをコピー
COPY server/ ./

# データベースディレクトリを作成
RUN mkdir -p /app/server/database

# TypeScriptをコンパイル
RUN npm run build

# ========================================
# Step 2: Build Frontend (React)
# ========================================
FROM node:latest AS client-build

WORKDIR /app/client

# package.json だけコピーして依存関係をインストール
COPY client/package*.json ./
RUN npm install

# フロントエンドのソースコードをコピー
COPY client/ ./

# Reactアプリをビルド
RUN npm run build

# ========================================
# Step 3: Final Production Image
# ========================================
FROM node:latest

WORKDIR /app

# バックエンドとフロントエンドのビルド成果物をコピー
COPY --from=server-build /app/server /app/server
COPY --from=client-build /app/client/build /app/server/public

# データベースディレクトリを作成
RUN mkdir -p /app/server/database

# 環境変数の設定（NODE_ENVのみデフォルト値を設定）
ENV NODE_ENV=production

# シードスクリプトを実行してからサーバーを起動
CMD cd /app/server && npx ts-node src/scripts/seed.ts && node dist/app.js
