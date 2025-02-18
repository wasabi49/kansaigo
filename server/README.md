# バックエンド API 環境構築ガイド

## プロジェクト構成

```
2025_24/
├── api/
│   ├── src/
│   │   ├── routes/           # ルーティング
│   │   │   ├── auth.ts       # 認証関連
│   │   │   ├── dialects.ts   # 方言関連
│   │   │   ├── quests.ts     # クエスト関連
│   │   │   └── users.ts      # ユーザー関連
│   │   ├── scripts/
│   │   │   └── seed.ts       # DBシード
│   │   ├── types/
│   │   │   ├── ModeSeedData.ts
│   │   │   └── QuestSeedData.ts
│   │   ├── data/
│   │   │   ├── modes.json    # 方言モードデータ
│   │   │   └── quests.json   # クエストデータ
│   │   ├── app.ts            # アプリケーションのエントリーポイント
│   │   └── db.ts             # データベース設定
│   ├── .gitignore
│   ├── package.json          # 依存パッケージ設定
│   └── tsconfig.json         # TypeScript設定
├── docker-compose.yml        # Docker環境設定
└── .env                      # 環境変数
```

## 各ディレクトリ・ファイルの説明

### ルートディレクトリ

- `docker-compose.yml`: Docker 環境の設定
- `.env`: 環境変数の設定（ポート番号など）

### api/ディレクトリ

- `src/`: ソースコードのルートディレクトリ

  - `routes/`: API エンドポイントの実装
  - `scripts/`: データベース初期化スクリプト
  - `types/`: TypeScript 型定義
  - `data/`: シード用の JSON データ
  - `app.ts`: アプリケーションのメインファイル
  - `db.ts`: データベース接続設定

- `package.json`: Node.js の依存パッケージ管理
- `tsconfig.json`: TypeScript のコンパイル設定
- `.gitignore`: Git の除外ファイル設定

## 開発の始め方

1. 必要なファイルを配置
2. 環境変数の設定(必要に応じて)
3. アプリケーションの起動:
   ```bash
   docker-compose up -d
   ```
4. アプリケーションの停止:
    ```bach
    docker-compose down
    ```

## 注意事項
- デフォルトのポートは、8080です
- データベースファイル（`database.sqlite`）は`api/`ディレクトリに作成されます
- `node_modules`は Docker コンテナ内で管理されます
- ソースコードの変更は自動的に反映されます(ホットリロード)
