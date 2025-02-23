# server/Dockerfile
# ベースイメージとして最新のNode.jsを使用
FROM node:latest AS server-build

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピーして依存関係をインストール
COPY server/package*.json ./
RUN npm install

# 残りのソースコードをコピー
COPY server/ ./

# データベースディレクトリを作成し、データベースを初期化
RUN mkdir -p /app/database && npx ts-node src/scripts/seed.ts

# 開発サーバーを起動
CMD ["npm", "run", "dev"]

# client/Dockerfile
# ベースイメージとして最新のNode.jsを使用
FROM node:latest AS client-build

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピーして依存関係をインストール
COPY client/package*.json ./
RUN npm install

# 残りのソースコードをコピー
COPY client/ ./

# ビルドコマンドを実行
RUN npm run build

# 最終ステージ
FROM node:latest AS final

# 作業ディレクトリを設定
WORKDIR /app

# serverとclientのビルド成果物をコピー
COPY --from=server-build /app /app/server
COPY --from=client-build /app/build /app/client/build

# 環境変数を設定
ENV NODE_ENV=production

# サーバーを起動
CMD ["node", "/2025_24/server/src/app.js"]