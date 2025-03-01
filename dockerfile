# ========================================
# Step 1: Build Backend (Express + TypeScript)
# ========================================
FROM node:18-bullseye AS server-build

WORKDIR /app/server

# 必要なビルドツールをインストール
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-setuptools \
    python3-distutils \
    make \
    g++ \
    sqlite3 \
    libsqlite3-dev \
    curl \
    bash

# package.json だけコピーして依存関係をインストール
COPY server/package*.json ./

# node-gypのセットアップ
RUN npm install -g node-gyp

# `sqlite3` をインストール（Docker内でバイナリを再ビルド）
RUN npm install --unsafe-perm --build-from-source sqlite3 || npm install sqlite3

# TypeScriptのコンパイルが必要なため、`typescript` をインストール
RUN npm install -g typescript

# 残りのバックエンドのソースコードをコピー
COPY server/ ./

# TypeScriptをコンパイル（`dist` ディレクトリに出力）
RUN npm run build

# ========================================
# Step 2: Build Frontend (React)
# ========================================
FROM node:18-bullseye AS client-build

WORKDIR /app/client

# package.json だけコピーして依存関係をインストール
COPY client/package*.json ./
RUN npm install

# 残りのフロントエンドのソースコードをコピー
COPY client/ ./

# Reactアプリをビルド
RUN npm run build

# ========================================
# Step 3: Final Production Image
# ========================================
FROM node:18-bullseye AS final

WORKDIR /app

# バックエンドとフロントエンドのビルド成果物をコピー
COPY --from=server-build /app/server /app/server
COPY --from=client-build /app/client/build /app/server/public

# /data ディレクトリを作成し、永続化
RUN mkdir -p /data

# 環境変数の設定
ENV NODE_ENV=production
ENV PORT=4000
ENV DATABASE_URL=/data/app.sqlite
ENV SESSION_DATABASE_URL=/data/sessions.sqlite

# ★ここに必要な環境変数を追加★
ENV GOOGLE_CLIENT_ID="your-google-client-id"
ENV GOOGLE_CLIENT_SECRET="your-google-client-secret"
ENV GOOGLE_CALLBACK_URL="your-google-callback-url"

# Expressサーバーを起動（dist/app.js を指定）
CMD ["node", "/app/server/dist/app.js"]
