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

# 環境変数の設定
ENV NODE_ENV=production
ENV PORT=${BACKEND_PORT:-4000}
ENV FRONTEND_ORIGIN=${FRONTEND_ORIGIN:-http://localhost:3000}
ENV FRONTEND_PORT=${FRONTEND_PORT:-3000}
ENV BACKEND_PORT=${BACKEND_PORT:-4000}
ENV REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL:-http://localhost:4000}
ENV SESSION_SECRET=${SESSION_SECRET:-change-me-in-production}
ENV FRONT_URL=${FRONT_URL:-http://localhost:3000}

# シードスクリプトを実行してからサーバーを起動
CMD cd /app/server && npx ts-node src/scripts/seed.ts && node dist/app.js
